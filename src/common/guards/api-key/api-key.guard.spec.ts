import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyGuard } from './api-key.guard';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyGuard,
        {
          provide: Reflector,
          useValue: {}, // mock simple
        },
        {
          provide: AuthService,
          useValue: {
            validateApiKey: jest.fn(), // mock des méthodes si besoin
          },
        },
      ],
    }).compile();

    guard = module.get<ApiKeyGuard>(ApiKeyGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});