import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtGenerateToken{
  constructor(
    private jwtService: JwtService
  ){}

  generateAccessToken(payload: any){
    return this.jwtService.sign(payload, {expiresIn: '1m'})
  }

  generateRefreshToken(payload: any){
    return this.jwtService.sign(payload, {expiresIn: '7d'})
  }

  verifyToken(token: string){
    try {
      return this.jwtService.verify(token, {secret: 'shaftoli'})
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}