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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutlineTreeResponseDto = exports.OutlineNodeResponseDto = exports.ReorderOutlineDto = exports.ReorderOutlineNodeDto = exports.UpdateOutlineNodeDto = exports.CreateOutlineNodeDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateOutlineNodeDto {
}
exports.CreateOutlineNodeDto = CreateOutlineNodeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutlineNodeDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutlineNodeDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutlineNodeDto.prototype, "parentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateOutlineNodeDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutlineNodeDto.prototype, "chapterId", void 0);
class UpdateOutlineNodeDto {
}
exports.UpdateOutlineNodeDto = UpdateOutlineNodeDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOutlineNodeDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOutlineNodeDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateOutlineNodeDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOutlineNodeDto.prototype, "chapterId", void 0);
class ReorderOutlineNodeDto {
}
exports.ReorderOutlineNodeDto = ReorderOutlineNodeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReorderOutlineNodeDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], ReorderOutlineNodeDto.prototype, "parentId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ReorderOutlineNodeDto.prototype, "order", void 0);
class ReorderOutlineDto {
}
exports.ReorderOutlineDto = ReorderOutlineDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReorderOutlineNodeDto),
    __metadata("design:type", Array)
], ReorderOutlineDto.prototype, "nodes", void 0);
class OutlineNodeResponseDto {
    constructor() {
        this.content = null;
        this.parentId = null;
        this.chapterId = null;
    }
}
exports.OutlineNodeResponseDto = OutlineNodeResponseDto;
class OutlineTreeResponseDto {
}
exports.OutlineTreeResponseDto = OutlineTreeResponseDto;
//# sourceMappingURL=outline.dto.js.map