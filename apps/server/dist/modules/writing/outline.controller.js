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
exports.OutlineController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const outline_service_1 = require("./outline.service");
const outline_dto_1 = require("./dto/outline.dto");
let OutlineController = class OutlineController {
    constructor(outlineService) {
        this.outlineService = outlineService;
    }
    /**
     * GET /works/:workId/outline
     * 获取完整大纲树
     */
    async getTree(workId) {
        // TODO: Add userId from JWT token
        return this.outlineService.getTree(workId, 'temp-user-id');
    }
    /**
     * POST /works/:workId/outline
     * 创建节点
     */
    async createNode(workId, createDto) {
        // TODO: Add userId from JWT token
        return this.outlineService.createNode(workId, 'temp-user-id', createDto);
    }
    /**
     * PATCH /works/:workId/outline/:id
     * 更新节点
     */
    async updateNode(workId, nodeId, updateDto) {
        // TODO: Add userId from JWT token
        return this.outlineService.updateNode(workId, nodeId, 'temp-user-id', updateDto);
    }
    /**
     * DELETE /works/:workId/outline/:id
     * 删除节点（级联删除子节点）
     */
    async deleteNode(workId, nodeId) {
        // TODO: Add userId from JWT token
        await this.outlineService.deleteNode(workId, nodeId, 'temp-user-id');
    }
    /**
     * POST /works/:workId/outline/reorder
     * 批量更新节点顺序（拖拽后调用）
     */
    async reorderNodes(workId, reorderDto) {
        // TODO: Add userId from JWT token
        return this.outlineService.reorderNodes(workId, 'temp-user-id', reorderDto.nodes);
    }
};
exports.OutlineController = OutlineController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('workId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OutlineController.prototype, "getTree", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('workId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, outline_dto_1.CreateOutlineNodeDto]),
    __metadata("design:returntype", Promise)
], OutlineController.prototype, "createNode", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('workId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, outline_dto_1.UpdateOutlineNodeDto]),
    __metadata("design:returntype", Promise)
], OutlineController.prototype, "updateNode", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('workId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OutlineController.prototype, "deleteNode", null);
__decorate([
    (0, common_1.Post)('reorder'),
    __param(0, (0, common_1.Param)('workId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, outline_dto_1.ReorderOutlineDto]),
    __metadata("design:returntype", Promise)
], OutlineController.prototype, "reorderNodes", null);
exports.OutlineController = OutlineController = __decorate([
    (0, common_1.Controller)('works/:workId/outline'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [outline_service_1.OutlineService])
], OutlineController);
//# sourceMappingURL=outline.controller.js.map