import { HttpStatus } from '@nestjs/common';

export const mongoErrorMapping: {
  [key: string]: { httpCode: HttpStatus; message: string };
} = {
  11000: {
    httpCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Already Exists',
  },
};
