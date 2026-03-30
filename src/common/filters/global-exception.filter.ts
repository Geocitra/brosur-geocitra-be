import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Default: Anggap Internal Server Error (500) jika bukan HttpException
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();

            // Ambil pesan spesifik dari HttpException (misal class class-validator atau error custom)
            message = typeof res === 'string' ? res : (res as any).message || res;
        } else if (exception instanceof Error) {
            // Logic Analis: Log error asli di konsol server untuk debug, 
            // TAPI jangan pernah kirim stack trace ini ke Frontend!
            console.error(`[FATAL ERROR] ${exception.message}`, exception.stack);
        }

        // Response JSON Baku yang Konsisten (Contract)
        response.status(status).json({
            success: false,
            statusCode: status,
            message: message,
            path: request.url, // Membantu FE tahu di URL mana ia gagal
            timestamp: new Date().toISOString(),
        });
    }
}