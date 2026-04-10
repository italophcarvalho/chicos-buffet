-- Script SQL para Supabase - Projeto Chico's Buffet

-- 1. Tabela de Leads (Contatos do Site e WhatsApp)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT,
    email TEXT,
    phone TEXT NOT NULL UNIQUE,
    source TEXT DEFAULT 'whatsapp', -- 'website_form' ou 'whatsapp'
    status TEXT DEFAULT 'novo', -- 'novo', 'qualificado', 'agendado', 'perdido'
    qualification_notes TEXT
);

-- 2. Tabela de Eventos (Pedidos de Orçamento/Agendamento)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    lead_id UUID REFERENCES public.leads(id),
    event_type TEXT, -- 'casamento', 'corporativo', etc.
    event_date DATE,
    estimated_guests INTEGER,
    location TEXT,
    details TEXT
);

-- 3. Tabela de Memória (Histórico de Chat para o Agente de IA)
-- O n8n pode gerenciar isso, mas ter uma tabela dedicada no Supabase garante persistência de longo prazo.
CREATE TABLE IF NOT EXISTS public.chat_memory (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT NOT NULL, -- Identificador único da sessão (ex: número do whatsapp)
    message JSONB NOT NULL, -- Objeto contendo o papel (user/assistant) e o conteúdo
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Índice para busca rápida de sessão
CREATE INDEX IF NOT EXISTS idx_chat_memory_session_id ON public.chat_memory (session_id);

-- Habilitar Realtime para Leads (Opcional, mas útil)
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
