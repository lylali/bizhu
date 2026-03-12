"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForeshadowController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const foreshadow_service_1 = require("./foreshadow.service");
const foreshadow_dto_1 = require("./foreshadow.dto");
let ForeshadowController = class ForeshadowController {
    constructor(foreshadowService) {
        this.foreshadowService = foreshadowService;
    }
    async getAll(workId) {
        return this.foreshadowService.getAll(workId);
    }
    async create(workId, request) {
        return this.foreshadowService.create(workId, request);
    }
    async update(workId, foreshadowId, request) {
        return this.foreshadowService.update(workId, foreshadowId, request);
    }
    async delete(workId, foreshadowId) {
        return this.foreshadowService.delete(workId, foreshadowId);
    }
};
exports.ForeshadowController = ForeshadowController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('workId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ForeshadowController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('workId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, foreshadow_dto_1.CreateForeshadowDto]),
    __metadata("design:returntype", Promise)
], ForeshadowController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('workId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, foreshadow_dto_1.UpdateForeshadowDto]),
    __metadata("design:returntype", Promise)
], ForeshadowController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('workId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ForeshadowController.prototype, "delete", null);
exports.ForeshadowController = ForeshadowController = __decorate([
    (0, common_1.Controller)('works/:workId/foreshadows'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [foreshadow_service_1.ForeshadowService])
], ForeshadowController);
//# sourceMappingURL=foreshadow.controller.js.map