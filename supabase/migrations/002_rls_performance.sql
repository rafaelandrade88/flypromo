-- FlightWatch - Otimização de RLS e correção de SECURITY DEFINER
-- Versão: 1.3.0
--
-- Bug 4: Envolve auth.uid() em (select ...) para que o planner avalie a
--        função uma única vez por query (initplan) em vez de uma vez por linha.
-- Bug 5: Fixa search_path em handle_new_user() (SECURITY DEFINER) para evitar
--        sequestro de search_path.

-- ============================================================
-- profiles
-- ============================================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING ((select auth.uid()) = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING ((select auth.uid()) = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);

-- ============================================================
-- search_history
-- ============================================================
DROP POLICY IF EXISTS "Users can view own searches" ON public.search_history;
DROP POLICY IF EXISTS "Users can insert own searches" ON public.search_history;
DROP POLICY IF EXISTS "Users can delete own searches" ON public.search_history;

CREATE POLICY "Users can view own searches" ON public.search_history
  FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert own searches" ON public.search_history
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can delete own searches" ON public.search_history
  FOR DELETE USING ((select auth.uid()) = user_id);

-- ============================================================
-- favorites
-- ============================================================
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;

CREATE POLICY "Users can view own favorites" ON public.favorites
  FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert own favorites" ON public.favorites
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites
  FOR DELETE USING ((select auth.uid()) = user_id);

-- ============================================================
-- handle_new_user(): fixa search_path (Bug 5)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
