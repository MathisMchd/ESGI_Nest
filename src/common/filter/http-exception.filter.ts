import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()  // sans argument = capture TOUTES les exceptions (HTTP et non-HTTP)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  // l'argument host de la fonction catch() est une abstraction générique que NestJS utilise dans les filtres et interceptors.
  // NestJS peut fonctionner sur plusieurs protocoles : HTTP, WebSockets, microservices (TCP, Redis...)
  catch(exception: unknown, host: ArgumentsHost): void {

    console.log('Exception capturée par HttpExceptionFilter:', exception);
    // préciser quel est le protocole de communication utilisé.
    // ctx est une convention pour context, ici : "tout ce dont j'ai besoin pour interagir avec la requête HTTP en cours".
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[];
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      // class-validator retourne ses messages dans body.message (tableau de strings)
      message = typeof body === 'string' ? body : (body as any).message ?? exception.message;
      error = this.statusToError(status);
    } else {
      // Erreur interne non anticipée
      status = 500;
      error = 'Internal Server Error';
      message = 'An unexpected error occurred. Please contact support.';
      // Détail de l'erreur loggé côté serveur uniquement — jamais exposé au client
      this.logger.error('Unhandled exception', exception instanceof Error ? exception.stack : String(exception));
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

   private statusToError(status: number): string {
    switch (status) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      case 409:
        return 'Conflict';
      case 422:
        return 'Unprocessable Entity';
      case 500:
        return 'Internal Server Error';
      default:
        return 'Error';
    }
  }
}