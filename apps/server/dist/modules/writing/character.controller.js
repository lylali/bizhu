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
exports.CharacterController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const character_service_1 = require("./character.service");
const character_dto_1 = require("./character.dto");
let CharacterController = class CharacterController {
    constructor(characterService) {
        this.characterService = characterService;
    }
    async getAll(workId) {
        return this.characterService.getAll(workId);
    }
    async getAllRelations(workId) {
        return this.characterService.getAllRelations(workId);
    }
    async create(workId, request) {
        return this.characterService.create(workId, request);
    }
    async getById(workId, characterId) {
        return this.characterService.getById(workId, characterId);
    }
    async update(workId, characterId, request) {
        return this.characterService.update(workId, characterId, request);
    }
    async delete(workId, characterId) {
        return this.characterService.delete(workId, characterId);
    }
    async updatePosition(workId, characterId, request) {
        return this.characterService.updatePosition(workId, characterId, request);
    }
    async createRelation(workId, request) {
        return this.characterService.createRelation(workId, request);
    }
    async deleteRelation(workId, relationId) {
        return this.characterService.deleteRelation(workId, relationId);
    }
};
exports.CharacterController = CharacterController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('workId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('relations'),
    __param(0, (0, common_1.Param)('workId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "getAllRelations", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('workId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, character_dto_1.CreateCharacterDto]),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('workId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('workId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, character_dto_1.UpdateCharacterDto]),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('workId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':id/position'),
    __param(0, (0, common_1.Param)('workId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, character_dto_1.UpdateCharacterPositionDto]),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "updatePosition", null);
__decorate([
    (0, common_1.Post)('relations'),
    __param(0, (0, common_1.Param)('workId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, character_dto_1.CreateCharacterRelationDto]),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "createRelation", null);
__decorate([
    (0, common_1.Delete)('relations/:relationId'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('workId')),
    __param(1, (0, common_1.Param)('relationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "deleteRelation", null);
exports.CharacterController = CharacterController = __decorate([
    (0, common_1.Controller)('works/:workId/characters'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [character_service_1.CharacterService])
], CharacterController);
//# sourceMappingURL=character.controller.js.map