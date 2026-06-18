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
exports.UpdateTeacherDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UpdateTeacherDto {
    full_name;
    password;
    phone;
    email;
    address;
    groups;
}
exports.UpdateTeacherDto = UpdateTeacherDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Ali Valiyev" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTeacherDto.prototype, "full_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "StrongPass123" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTeacherDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "+998990009988" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTeacherDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "teacher@mail.com" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateTeacherDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Toshkent sh. Chilonzor tumani" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTeacherDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [Number], example: [1, 2] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!value)
            return undefined;
        if (typeof value === "string") {
            try {
                return JSON.parse(value);
            }
            catch {
                return value.split(",").map(v => Number(v.trim()));
            }
        }
        if (Array.isArray(value)) {
            return value.map(v => Number(v));
        }
        return undefined;
    }),
    __metadata("design:type", Array)
], UpdateTeacherDto.prototype, "groups", void 0);
//# sourceMappingURL=update.dto.js.map