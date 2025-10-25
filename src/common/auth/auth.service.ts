import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly validTokens = new Set([
    'admin-token-123',
    'user-token-456',
    'api-token-789'
  ]);

  validateToken(token: string): boolean {
    if (!token) {
      return false;
    }

    return this.validTokens.has(token);
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  validateRequest(authHeader: string): void {
    const token = this.extractTokenFromHeader(authHeader);
    
    if (!token || !this.validateToken(token)) {
      throw new UnauthorizedException('Invalid or missing API token');
    }
  }
}
