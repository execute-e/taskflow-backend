import { isDev } from '@/shared/utils/is-dev.util';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha';
import { Request } from 'express';

export function getRecaptchaConfig(
  configService: ConfigService,
): GoogleRecaptchaModuleOptions {
  return {
    secretKey: configService.getOrThrow<string>('GOOGLE_RECAPTCHA_SECRET_KEY'),
    response: (req: Request) => {
      const token = req.headers.recaptcha;

      if (!token)
        throw new HttpException(
          'Missing recaptcha token',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      return Array.isArray(token) ? token[0] : token;
    },
    skipIf: isDev(configService),
  };
}
