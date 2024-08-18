"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCommonResponses = ApiCommonResponses;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function ApiCommonResponses() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado' }), (0, swagger_1.ApiBadRequestResponse)({ description: 'Requisição inválida' }));
}
//# sourceMappingURL=api.response.js.map