"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WritingModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const chapter_controller_1 = require("./chapter.controller");
const chapter_service_1 = require("./chapter.service");
const yjs_service_1 = require("./yjs.service");
const yjs_gateway_1 = require("./yjs.gateway");
let WritingModule = class WritingModule {
};
exports.WritingModule = WritingModule;
exports.WritingModule = WritingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: { expiresIn: '24h' },
            }),
        ],
        controllers: [chapter_controller_1.ChapterController],
        providers: [chapter_service_1.ChapterService, yjs_service_1.YjsService, yjs_gateway_1.YjsGateway],
        exports: [chapter_service_1.ChapterService, yjs_service_1.YjsService],
    })
], WritingModule);
//# sourceMappingURL=writing.module.js.map