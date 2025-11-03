import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: '메모 내용이 필요합니다.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    // OpenAI 클라이언트 초기화
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // 메모 요약을 위한 프롬프트 구성
    const prompt = `다음 메모 내용을 간결하고 명확하게 요약해주세요. 핵심 내용과 중요한 포인트들을 포함하여 3-5문장으로 요약해주세요.

메모 내용:
${content}

요약:`

    // GPT-4o-mini 모델로 콘텐츠 생성
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.3,
      top_p: 0.95,
    })

    const summary = response.choices[0]?.message?.content

    if (!summary) {
      return NextResponse.json(
        { error: '요약을 생성할 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      summary: summary.trim(),
      success: true,
    })
  } catch (error) {
    console.error('메모 요약 오류:', error)
    return NextResponse.json(
      { error: '요약 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
