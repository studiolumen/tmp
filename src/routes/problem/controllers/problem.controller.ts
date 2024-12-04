import {
  Body,
  Controller,
  Delete,
  Get,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { CustomJwtAuthGuard } from "../../../auth/guards";
import { PermissionGuard } from "../../../auth/guards/permission.guard";
import { UseGuardsWithSwagger } from "../../../auth/guards/useGuards";
import { PermissionEnum } from "../../../common/types";
import {
  CreateProblemDTO,
  GetFullProblemDTO,
  GetProblemListDTO,
  getTestcasesDTO,
  ProblemIdDTO,
  UpdateProblemDTO,
} from "../dto/problem.dto";
import { ProblemGetService } from "../providers";
import { ProblemManageService } from "../providers/problem.manage.service";
import { ProblemTestCaseService } from "../providers/problem.testcase.service";

@ApiTags("Problem")
@Controller("/problem")
export class ProblemController {
  constructor(
    private readonly problemGetService: ProblemGetService,
    private readonly problemPsadderService: ProblemManageService,
    private readonly problemTestcaseService: ProblemTestCaseService,
  ) {}

  @ApiOperation({
    summary: "get problem",
    description: "get single problem via id",
  })
  @Get("/")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard([PermissionEnum.GET_PUBLIC_PROBLEM]),
  )
  async getProblem(@Query() data: ProblemIdDTO) {
    return this.problemGetService.getPublicProblemById(data.id);
  }

  @ApiOperation({
    summary: "get problem list",
    description: "list problems",
  })
  @Get("/list")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard(
      [PermissionEnum.GET_PUBLIC_PROBLEM, PermissionEnum.GET_PROBLEM],
      true,
    ),
  )
  async getProblemList(@Req() req, @Query() data: GetProblemListDTO) {
    return this.problemGetService.getPublicProblemList(req.user, data.all);
  }

  @ApiOperation({
    summary: "get problem - no filter",
    description:
      "get user's single public problem with hidden testcases via id",
  })
  @Get("/full")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard(
      [PermissionEnum.GET_PROBLEM, PermissionEnum.GET_PROBLEM_SELF],
      true,
    ),
  )
  async getFullProblem(@Req() req, @Query() data: GetFullProblemDTO) {
    return this.problemGetService.getSelfProblemById(
      req.user,
      data.id,
      data.hidden,
    );
  }
  @ApiOperation({
    summary: "Create problem",
    description: "Create Public problem from given items",
  })
  @Post("/")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard([PermissionEnum.CREATE_PROBLEM]),
  )
  async createProblem(@Req() req, @Body() data: CreateProblemDTO) {
    return this.problemPsadderService.createProblem(req.user, data, true);
  }

  @ApiOperation({
    summary: "Update problem",
    description: "Problem from given items via name",
  })
  @Post("/update")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard(
      [PermissionEnum.MODIFY_PROBLEM_SELF, PermissionEnum.MODIFY_PROBLEM],
      true,
    ),
  )
  async updateProblem(@Req() req, @Body() data: UpdateProblemDTO) {
    return this.problemPsadderService.updateProblem(req.user, data);
  }

  @ApiOperation({
    summary: "Delete problem",
    description: "Delete problem via id",
  })
  @Delete("/")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard(
      [PermissionEnum.DELETE_PROBLEM_SELF, PermissionEnum.DELETE_PROBLEM],
      true,
    ),
  )
  async deleteProblem(@Req() req, @Query() data: ProblemIdDTO) {
    return this.problemPsadderService.deleteProblem(req.user, data.id);
  }

  @ApiOperation({
    summary: "get testcases",
    description: "get testcases",
  })
  @Get("/testcases")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard(
      [PermissionEnum.GET_PROBLEM_SELF, PermissionEnum.GET_PROBLEM],
      true,
    ),
  )
  async getTestcases(@Req() req, @Query() data: getTestcasesDTO) {
    return this.problemTestcaseService.getTestCases(
      req.user,
      data.id,
      data.from,
      data.count,
    );
  }
}
