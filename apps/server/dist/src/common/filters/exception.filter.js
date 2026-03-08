"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const library_1 = require("@prisma/client/runtime/library");
let ExceptionFilter = class ExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger('ExceptionFilter');
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let errorMessage = 'Internal server error';
        let errorCode;
        if (exception instanceof common_1.HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object') {
                errorMessage =
                    exceptionResponse.message || exception.message;
            }
            else {
                errorMessage = exceptionResponse;
            }
        }
        else if (exception instanceof library_1.PrismaClientKnownRequestError) {
            // 处理 Prisma 错误
            statusCode = common_1.HttpStatus.BAD_REQUEST;
            errorCode = exception.code;
            switch (exception.code) {
                case 'P2002':
                    errorMessage = `Unique constraint failed: ${exception.meta?.target?.join(', ') || 'field'}`;
                    break;
                case 'P2025':
                    errorMessage = 'Record not found';
                    statusCode = common_1.HttpStatus.NOT_FOUND;
                    break;
                case 'P2003':
                    errorMessage = 'Foreign key constraint failed';
                    break;
                default:
                    errorMessage = exception.message;
            }
        }
        else if (exception instanceof Error) {
            errorMessage = exception.message;
        }
        this.logger.error(`[${statusCode}] ${errorMessage}`, exception instanceof Error ? exception.stack : '');
        const errorResponse = {
            success: false,
            error: errorMessage,
            meta: {
                timestamp: new Date().toISOString(),
                ...(errorCode && { code: errorCode }),
            },
        };
        response.status(statusCode).json(errorResponse);
    }
};
exports.ExceptionFilter = ExceptionFilter;
exports.ExceptionFilter = ExceptionFilter = __decorate([
    (0, common_1.Catch)()
], ExceptionFilter);
//# sourceMappingURL=exception.filter.js.map