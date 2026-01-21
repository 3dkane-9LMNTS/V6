-- Database schema for 9LMNTS Studio Dashboard
-- Run this in your Supabase SQL editor

-- Create tables for the admin dashboard

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  project_type TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold', 'cancelled')),
  revenue DECIMAL(10,2) DEFAULT 0,
  client_name TEXT,
  client_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'payout', 'refund', 'fee')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT
);

-- Service requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  company TEXT,
  website TEXT,
  project_type TEXT NOT NULL,
  plan TEXT NOT NULL,
  timeline TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending_confirmation' CHECK (status IN ('pending_confirmation', 'email_sent', 'confirmed', 'cancelled')),
  email_sent_at TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Projects table (specific to AI Element services)
CREATE TABLE IF NOT EXISTS ai_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  ai_service_type TEXT NOT NULL CHECK (ai_service_type IN ('automation', 'machine_learning', 'chatbot', 'analytics', 'integration')),
  complexity_level TEXT DEFAULT 'medium' CHECK (complexity_level IN ('simple', 'medium', 'complex')),
  estimated_hours INTEGER,
  technologies TEXT[], -- Array of technologies used
  requirements JSONB, -- Detailed requirements
  deliverables JSONB, -- Project deliverables
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL CHECK (email_type IN ('service_confirmation', 'project_update', 'payment_request')),
  recipient_email TEXT NOT NULL,
  subject TEXT,
  content TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  error_message TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_email ON service_requests(client_email);
CREATE INDEX IF NOT EXISTS idx_ai_projects_service_type ON ai_projects(ai_service_type);

-- Create RLS (Row Level Security) policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Policies for projects table
CREATE POLICY "Users can view all projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Users can insert projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update projects" ON projects FOR UPDATE USING (true);
CREATE POLICY "Users can delete projects" ON projects FOR DELETE USING (true);

-- Policies for transactions table
CREATE POLICY "Users can view all transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Users can insert transactions" ON transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update transactions" ON transactions FOR UPDATE USING (true);
CREATE POLICY "Users can delete transactions" ON transactions FOR DELETE USING (true);

-- Policies for service requests table
CREATE POLICY "Users can view all service requests" ON service_requests FOR SELECT USING (true);
CREATE POLICY "Users can insert service requests" ON service_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update service requests" ON service_requests FOR UPDATE USING (true);
CREATE POLICY "Users can delete service requests" ON service_requests FOR DELETE USING (true);

-- Policies for AI projects table
CREATE POLICY "Users can view all AI projects" ON ai_projects FOR SELECT USING (true);
CREATE POLICY "Users can insert AI projects" ON ai_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update AI projects" ON ai_projects FOR UPDATE USING (true);
CREATE POLICY "Users can delete AI projects" ON ai_projects FOR DELETE USING (true);

-- Policies for email logs table
CREATE POLICY "Users can view all email logs" ON email_logs FOR SELECT USING (true);
CREATE POLICY "Users can insert email logs" ON email_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update email logs" ON email_logs FOR UPDATE USING (true);
CREATE POLICY "Users can delete email logs" ON email_logs FOR DELETE USING (true);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_projects_updated_at BEFORE UPDATE ON ai_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO projects (name, project_type, status, revenue, client_name, client_email, description) VALUES
('Sound Clash OS', 'music_platform', 'active', 13620.00, 'Marcus Chen', 'marcus@techcorp.com', 'Music streaming platform with social features'),
('Wedding OS', 'event_management', 'active', 8450.00, 'Sarah Martinez', 'sarah@clubvertex.com', 'Wedding planning and management system'),
('Corporate Clash', 'business_portal', 'active', 24100.00, 'David Park', 'david@startupsummit.com', 'Corporate event management platform'),
('AI Element - Automation', 'ai_automation', 'active', 18300.00, 'Lisa Chen', 'lisa@innovateco.com', 'AI-powered business automation system');

INSERT INTO transactions (project_id, amount, type, status, description) VALUES
((SELECT id FROM projects WHERE name = 'Sound Clash OS'), 2540.74, 'payout', 'completed', 'Monthly revenue share'),
((SELECT id FROM projects WHERE name = 'Wedding OS'), 15678.21, 'deposit', 'completed', 'Initial project deposit'),
((SELECT id FROM projects WHERE name = 'Corporate Clash'), 173.50, 'refund', 'cancelled', 'Cancelled feature refund'),
((SELECT id FROM projects WHERE name = 'AI Element - Automation'), 0.5256, 'fee', 'pending', 'Transaction processing fee');

INSERT INTO ai_projects (project_id, ai_service_type, complexity_level, estimated_hours, technologies, requirements, deliverables) VALUES
((SELECT id FROM projects WHERE name = 'AI Element - Automation'), 'automation', 'complex', 120, 
 ARRAY['Python', 'TensorFlow', 'React', 'Node.js', 'PostgreSQL'],
 '{"business_processes": ["inventory_management", "customer_service", "data_analysis"], "integration_requirements": ["existing_crm", "accounting_software"]}',
 '{"automation_workflows": 5, "dashboards": 3, "api_endpoints": 12, "documentation": "complete"}');
