-- Create comprehensive VoltMarket database schema

-- Create enums
CREATE TYPE public.voltmarket_listing_status AS ENUM ('active', 'sold', 'under_contract', 'withdrawn');
CREATE TYPE public.voltmarket_document_type AS ENUM ('financial', 'legal', 'technical', 'marketing', 'due_diligence', 'other');
CREATE TYPE public.voltmarket_loi_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE public.voltmarket_verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Create voltmarket_listings table
CREATE TABLE public.voltmarket_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  asking_price NUMERIC NOT NULL,
  location TEXT NOT NULL,
  listing_type TEXT NOT NULL,
  power_capacity_mw NUMERIC,
  status voltmarket_listing_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create voltmarket_documents table
CREATE TABLE public.voltmarket_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID,
  uploader_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT,
  document_type voltmarket_document_type NOT NULL,
  is_private BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create voltmarket_lois table
CREATE TABLE public.voltmarket_lois (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  status voltmarket_loi_status NOT NULL DEFAULT 'pending',
  offered_price NUMERIC NOT NULL,
  conditions TEXT,
  timeline_days INTEGER,
  additional_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE
);

-- Create voltmarket_portfolios table
CREATE TABLE public.voltmarket_portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  portfolio_type TEXT NOT NULL DEFAULT 'investment',
  total_value NUMERIC DEFAULT 0,
  target_allocation JSONB DEFAULT '{}',
  risk_tolerance TEXT DEFAULT 'moderate',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create voltmarket_portfolio_items table
CREATE TABLE public.voltmarket_portfolio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL,
  listing_id UUID,
  item_type TEXT NOT NULL DEFAULT 'listing',
  name TEXT NOT NULL,
  acquisition_price NUMERIC,
  current_value NUMERIC,
  acquisition_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create voltmarket_analytics table
CREATE TABLE public.voltmarket_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create voltmarket_nda_requests table
CREATE TABLE public.voltmarket_nda_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL,
  requester_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE
);

-- Create voltmarket_conversations table
CREATE TABLE public.voltmarket_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID,
  participant_ids UUID[] NOT NULL,
  title TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create voltmarket_reviews table
CREATE TABLE public.voltmarket_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL,
  reviewer_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create voltmarket_saved_searches table
CREATE TABLE public.voltmarket_saved_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  search_criteria JSONB NOT NULL,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create voltmarket_watchlist table
CREATE TABLE public.voltmarket_watchlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  listing_id UUID NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Create voltmarket_verification table
CREATE TABLE public.voltmarket_verification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  verification_type TEXT NOT NULL,
  status voltmarket_verification_status NOT NULL DEFAULT 'pending',
  documents JSONB DEFAULT '[]',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Create voltmarket_due_diligence table
CREATE TABLE public.voltmarket_due_diligence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  documents JSONB DEFAULT '[]',
  notes TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.voltmarket_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_lois ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_nda_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_due_diligence ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for voltmarket_listings
CREATE POLICY "Anyone can view active listings" ON public.voltmarket_listings
FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create listings" ON public.voltmarket_listings
FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their listings" ON public.voltmarket_listings
FOR UPDATE USING (auth.uid() = seller_id);

-- Create RLS policies for voltmarket_documents
CREATE POLICY "Users can view their own documents" ON public.voltmarket_documents
FOR SELECT USING (auth.uid() = uploader_id);

CREATE POLICY "Users can create documents" ON public.voltmarket_documents
FOR INSERT WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Users can update their documents" ON public.voltmarket_documents
FOR UPDATE USING (auth.uid() = uploader_id);

CREATE POLICY "Users can delete their documents" ON public.voltmarket_documents
FOR DELETE USING (auth.uid() = uploader_id);

-- Create RLS policies for voltmarket_lois
CREATE POLICY "Users can view LOIs they're involved in" ON public.voltmarket_lois
FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can create LOIs" ON public.voltmarket_lois
FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update LOI status" ON public.voltmarket_lois
FOR UPDATE USING (auth.uid() = seller_id);

-- Create RLS policies for other tables
CREATE POLICY "Users can manage their portfolios" ON public.voltmarket_portfolios
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their portfolio items" ON public.voltmarket_portfolio_items
FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.voltmarket_portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can view their analytics" ON public.voltmarket_analytics
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their requests" ON public.voltmarket_nda_requests
FOR ALL USING (auth.uid() = requester_id);

CREATE POLICY "Users can view conversations they're in" ON public.voltmarket_conversations
FOR ALL USING (auth.uid() = ANY(participant_ids));

CREATE POLICY "Users can view all reviews" ON public.voltmarket_reviews
FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.voltmarket_reviews
FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can manage their saved searches" ON public.voltmarket_saved_searches
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their watchlist" ON public.voltmarket_watchlist
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their verification" ON public.voltmarket_verification
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view due diligence they're involved in" ON public.voltmarket_due_diligence
FOR ALL USING (auth.uid() = buyer_id OR auth.uid() IN (SELECT seller_id FROM public.voltmarket_listings WHERE id = listing_id));

-- Add foreign key constraints
ALTER TABLE public.voltmarket_portfolio_items ADD CONSTRAINT fk_portfolio 
FOREIGN KEY (portfolio_id) REFERENCES public.voltmarket_portfolios(id) ON DELETE CASCADE;

-- Add triggers for updated_at
CREATE TRIGGER update_voltmarket_listings_updated_at
BEFORE UPDATE ON public.voltmarket_listings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_voltmarket_documents_updated_at
BEFORE UPDATE ON public.voltmarket_documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_voltmarket_portfolios_updated_at
BEFORE UPDATE ON public.voltmarket_portfolios
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_voltmarket_portfolio_items_updated_at
BEFORE UPDATE ON public.voltmarket_portfolio_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();