import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabase = createClient(projectId, publicAnonKey);

// Real-time data hooks for admin dashboard
export const useRealTimeData = () => {
  const [projects, setProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    fetchDashboardData();

    // Set up real-time subscriptions
    const projectsSubscription = supabase
      .channel('projects_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          fetchDashboardData();
        }
      );

    const transactionsSubscription = supabase
      .channel('transactions_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          fetchDashboardData();
        }
      );

    return () => {
      projectsSubscription.unsubscribe();
      transactionsSubscription.unsubscribe();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects data
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch transactions data
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate total revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'completed');

      if (!projectsError && projectsData) {
        setProjects(projectsData);
      }

      if (!transactionsError && transactionsData) {
        setTransactions(transactionsData);
      }

      if (!revenueError && revenueData) {
        const total = revenueData.reduce((sum, item) => sum + (item.amount || 0), 0);
        setRevenue(total);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    transactions,
    revenue,
    loading,
    refetch: fetchDashboardData
  };
};

// Email service for sending confirmations
export const sendServiceConfirmationEmail = async (formData: any) => {
  try {
    // Store the service request in Supabase
    const { data, error } = await supabase
      .from('service_requests')
      .insert([
        {
          client_name: formData.name,
          client_email: formData.email,
          client_phone: formData.phone,
          company: formData.company,
          website: formData.website,
          project_type: formData.projectType,
          plan: formData.plan,
          timeline: formData.timeline,
          description: formData.description,
          status: 'pending_confirmation',
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;

    // In a real implementation, you would call your email service here
    // For now, we'll just update the status to indicate email was sent
    await supabase
      .from('service_requests')
      .update({ 
        status: 'email_sent',
        email_sent_at: new Date().toISOString()
      })
      .eq('id', data[0].id);

    return { success: true, requestId: data[0].id };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error };
  }
};

// Confirm service request via email link
export const confirmServiceRequest = async (requestId: string) => {
  try {
    const { error } = await supabase
      .from('service_requests')
      .update({ 
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error confirming service request:', error);
    return { success: false, error };
  }
};

// Get service request details
export const getServiceRequest = async (requestId: string) => {
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching service request:', error);
    return { success: false, error };
  }
};

// Analytics functions
export const getProjectStats = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('status, project_type, revenue, created_at');

    if (error) throw error;

    // Calculate stats
    const stats = {
      totalProjects: data.length,
      activeProjects: data.filter(p => p.status === 'active').length,
      completedProjects: data.filter(p => p.status === 'completed').length,
      totalRevenue: data.reduce((sum, p) => sum + (p.revenue || 0), 0),
      projectsByType: data.reduce((acc, p) => {
        acc[p.project_type] = (acc[p.project_type] || 0) + 1;
        return acc;
      }, {}),
      monthlyRevenue: data.reduce((acc, p) => {
        const month = new Date(p.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        acc[month] = (acc[month] || 0) + (p.revenue || 0);
        return acc;
      }, {})
    };

    return { success: true, stats };
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return { success: false, error };
  }
};
