import { NextResponse } from 'next/server';

const CALLBACK_URL = process.env.BOT_API_CALLBACK;

export async function POST(req: Request) {
  const { threadId, message } = await req.json();

  if (!CALLBACK_URL) {
    return NextResponse.json(
      { error: 'CALLBACK_URL não está definida no ambiente.' },
      { status: 500 }
    );
  }

  if (!threadId || !message) {
    return NextResponse.json(
      { error: 'Parâmetros threadId e message são obrigatórios.' },
      { status: 400 }
    );
  }

  try {

    const response = await fetch(`${CALLBACK_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, message })
    });


    if (!response.ok) {
      throw new Error(`Erro na resposta do servidor: ${response.statusText}`);
    }

    return NextResponse.json({ message: 'Callback enviado com sucesso.' });
  } catch {
    return NextResponse.json(
        { error: 'Callback error' },
        { status: 408 }
      )
  }
}
