import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt/dist/jwt.service";
import { NextFunction, Request, Response } from "express";
import { JwtStrategy } from "src/modules/auth/jwt.strategy";
import { TJwtPayload } from "src/types";

@Injectable()
export class AuthMiddleware implements NestMiddleware{
  constructor(private readonly jwtStrategy: JwtStrategy, private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const user = this.jwtService.verify<TJwtPayload>(token, { secret: process.env.JWT_SECRET });

      if(user) {
        req.user = this.jwtStrategy.validate(user);
      }
    }

    next();
  }
}