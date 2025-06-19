import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/database/schemas";
import { users } from "@/server/database/schemas/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Schema de validação para login
const loginSchema = z.object({
  email: z.string().email("Email inválido").toLowerCase().trim(),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Interface para o payload do JWT
interface JWTPayload {
  id: string;
  email: string;
  name: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verificar se JWT_SECRET está configurado
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET não está configurado");
      return NextResponse.json(
        {
          error: "Configuração do servidor incompleta",
          code: "SERVER_CONFIGURATION_ERROR",
        },
        { status: 500 }
      );
    }

    // Validação de Content-Type
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        {
          error: "Content-Type deve ser application/json",
          code: "INVALID_CONTENT_TYPE",
        },
        { status: 400 }
      );
    }

    // Parse seguro do JSON
    let body;
    try {
      const rawBody = await request.text();
      if (!rawBody.trim()) {
        return NextResponse.json(
          {
            error: "Body da requisição não pode estar vazio",
            code: "EMPTY_BODY",
          },
          { status: 400 }
        );
      }
      body = JSON.parse(rawBody);
    } catch (jsonError) {
      return NextResponse.json(
        {
          error: "JSON inválido na requisição",
          code: "INVALID_JSON",
        },
        { status: 400 }
      );
    }

    // Validação dos dados de entrada
    const validatedData = loginSchema.parse(body);

    // Buscar usuário por email
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        passwordHash: users.passwordHash,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    // Verificar se usuário existe e está ativo
    if (!user) {
      return NextResponse.json(
        {
          error: "Credenciais inválidas",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          error: "Conta desativada",
          code: "ACCOUNT_DEACTIVATED",
        },
        { status: 401 }
      );
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "Credenciais inválidas",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 }
      );
    }

    // Criar payload do JWT
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    // Gerar token JWT com expiração de 1 hora
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "1h",
      issuer: "omnia-system",
      audience: "omnia-users",
    });

    // Atualizar último login (opcional)
    await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Log de auditoria (sem dados sensíveis)

    return NextResponse.json(
      {
        message: "Login realizado com sucesso",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        expiresIn: "1h",
        tokenType: "Bearer",
      },
      { status: 200 }
    );
  } catch (error) {
    // Log de erro seguro (sem dados sensíveis)
    const errorId = Math.random().toString(36).substring(7);
    console.error(`[${errorId}] Authentication error:`, {
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    // Erro de validação do Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Dados de entrada inválidos",
          code: "VALIDATION_ERROR",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Erro de JWT
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return NextResponse.json(
        {
          error: "Erro na geração do token",
          code: "TOKEN_GENERATION_ERROR",
          errorId,
        },
        { status: 500 }
      );
    }

    // Erro genérico (sem exposição de detalhes)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        code: "INTERNAL_ERROR",
        errorId,
      },
      { status: 500 }
    );
  }
}
