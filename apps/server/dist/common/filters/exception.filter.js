"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const library_1 = require("@prisma/client/runtime/library");
let ExceptionFilter = (() => {
    let _classDecorators = [(0, common_1.Catch)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExceptionFilter = _classThis = class {
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
    __setFunctionName(_classThis, "ExceptionFilter");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExceptionFilter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExceptionFilter = _classThis;
})();
exports.ExceptionFilter = ExceptionFilter;
//# sourceMappingURL=exception.filter.js.map