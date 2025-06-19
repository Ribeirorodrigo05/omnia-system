import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/database/schemas";
import { users } from "@/server/database/schemas/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Schema de validação para criação de usuário
const createUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  profileMetadata: z.object({}).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Verificar se há conteúdo no body
    const contentType = request.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        {
          error: 'Content-Type deve ser application/json',
          code: 'INVALID_CONTENT_TYPE'
        },
        { status: 400 }
      );
    }

    // Parse do body da requisição com tratamento de erro
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      return NextResponse.json(
        {
          error: 'JSON inválido ou malformado',
          code: 'INVALID_JSON'
        },
        { status: 400 }
      );
    }

    // Verificar se o body não está vazio
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        {
          error: 'Body da requisição deve ser um objeto JSON válido',
          code: 'EMPTY_BODY'
        },
        { status: 400 }
      );
    }

    // Validação dos dados de entrada
    const validatedData = createUserSchema.parse(body);

    // Verificar se o email já existe no banco de dados
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          error: "Email já está em uso",
          code: "EMAIL_ALREADY_EXISTS",
        },
        { status: 400 }
      );
    }

    // Criptografar a senha
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);

    // Criar o usuário no banco de dados
    const [newUser] = await db
      .insert(users)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        passwordHash: passwordHash,
        profileMetadata: validatedData.profileMetadata || {},
        isActive: true,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        isActive: users.isActive,
      });

    return NextResponse.json(
      {
        message: "Usuário criado com sucesso",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar usuário:", error);

    // Tratamento de erro de validação do Zod
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

    // Tratamento de erro de banco de dados
    if (error instanceof Error && error.message.includes("unique")) {
      return NextResponse.json(
        {
          error: "Email já está em uso",
          code: "EMAIL_ALREADY_EXISTS",
        },
        { status: 400 }
      );
    }

    // Erro genérico do servidor
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
