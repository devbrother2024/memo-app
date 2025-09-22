'use server'

import { revalidatePath } from 'next/cache'
import { supabaseServerClient } from '@/utils/supabase/server'
import { Memo, MemoFormData } from '@/types/memo'

const TABLE = 'memos'

export async function listMemos(): Promise<Memo[]> {
  const supabase = supabaseServerClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data || []).map(row => ({
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    tags: row.tags || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    aiSummary: row.ai_summary,
  })) as Memo[]
}

export async function createMemoAction(formData: MemoFormData): Promise<Memo> {
  const supabase = supabaseServerClient()
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  const memo: Memo = {
    id: data!.id,
    title: data!.title,
    content: data!.content,
    category: data!.category,
    tags: data!.tags || [],
    createdAt: data!.created_at,
    updatedAt: data!.updated_at,
    aiSummary: data!.ai_summary,
  }
  revalidatePath('/')
  return memo
}

export async function updateMemoAction(
  id: string,
  formData: MemoFormData
): Promise<Memo> {
  const supabase = supabaseServerClient()
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  const memo: Memo = {
    id: data!.id,
    title: data!.title,
    content: data!.content,
    category: data!.category,
    tags: data!.tags || [],
    createdAt: data!.created_at,
    updatedAt: data!.updated_at,
    aiSummary: data!.ai_summary,
  }
  revalidatePath('/')
  return memo
}

export async function updateMemoSummaryAction(
  id: string,
  summary: string
): Promise<void> {
  const supabase = supabaseServerClient()
  const { error } = await supabase
    .from(TABLE)
    .update({ ai_summary: summary })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/')
}

export async function deleteMemoAction(id: string): Promise<void> {
  const supabase = supabaseServerClient()
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
}
