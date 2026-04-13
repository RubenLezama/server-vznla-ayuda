export interface JwtPayload {
  sub: string;
  email: string;
  accountType: 'PERSON' | 'ORGANIZATION';
}
