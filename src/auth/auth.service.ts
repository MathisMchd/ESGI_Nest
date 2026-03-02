import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import { User } from 'src/User';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class AuthService {
    constructor(private readonly storage: StorageService) { }

    getMe(apiKey: string) {
        const user = this.findByApiKey(apiKey);
        if (!user) throw new NotFoundException('User not found');
        return { email: user.email, role: user.role, createdAt: user.createdAt };
    }


    register(email: string): { apiKey: string } {
        const users = this.storage.read<User[]>('users.json');

        if (users.some((u) => u.email === email)) {
            throw new ConflictException(`Email ${email} is already registered`); // → 409
        }

        const newUser: User = {
            id: uuidv4(),
            email,
            role: 'user',
            apiKey: uuidv4(),   // clef unique générée à l'inscription
            createdAt: new Date().toISOString(),
        };

        this.storage.write('users.json', [...users, newUser]);
        return { apiKey: newUser.apiKey };
    }

    regenerateKey(apiKey: string): { apiKey: string } {
        const users = this.storage.read<User[]>('users.json');
        const index = users.findIndex((u) => u.apiKey === apiKey);
        if (index === -1) throw new NotFoundException('User not found');

        const newKey = uuidv4();
        users[index] = { ...users[index], apiKey: newKey };
        this.storage.write('users.json', users);
        return { apiKey: newKey };
    }

    findByApiKey(apiKey: string): User | undefined {
        return this.storage.read<User[]>('users.json').find((u) => u.apiKey === apiKey);
    }

    deleteAccount(apiKey: string) {
        const users = this.storage.read<User[]>('users.json');
        const index = users.findIndex((u) => u.apiKey === apiKey);
        if (index === -1) throw new NotFoundException('User not found');
        users.splice(index, 1);
        this.storage.write('users.json', users);
    }
}