'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import Link from 'next/link';
import Loading from '@/components/loading/loading';
import {
  Bus,
  Users,
  Bell,
  Map,
  Calendar,
  FileText,
  Upload,
} from 'lucide-react';

interface StatsData {
  adminChallans: number;
  buses: number;
  drivers: number;
  notifications: number;
  routes: number;
  schedules: number;
  uploadedChallans: number;
}

const Stats = () => {
  const { data: session, status }: any = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.type !== 'admin') {
      router.push('/dashboard');
    } else if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.type === 'admin') {
      fetchStats();
    }
  }, [status, session, router]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [
        adminChallansRes,
        busesRes,
        driversRes,
        notificationsRes,
        routesRes,
        schedulesRes,
        uploadedChallansRes,
      ] = await Promise.all([
        axios.get('/api/adminChallan'),
        axios.get('/api/buses'),
        axios.get('/api/drivers'),
        axios.get('/api/notifications'),
        axios.get('/api/routes'),
        axios.get('/api/schedules'),
        axios.get('/api/uploaded-challans'),
      ]);

      setStats({
        adminChallans: adminChallansRes.data.adminChallans?.length || 0,
        buses: busesRes.data.buses?.length || 0,
        drivers: driversRes.data.drivers?.length || 0,
        notifications: notificationsRes.data.notifications?.length || 0,
        routes: routesRes.data.routes?.length || 0,
        schedules: schedulesRes.data.schedules?.length || 0,
        uploadedChallans: uploadedChallansRes.data.uploadChallans?.length || 0,
      });
    } catch (error) {
      toast.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !session) {
    return <Loading />;
  }

  if (session.user.type !== 'admin') {
    return null;
  }

  if (loading || !stats) {
    return <Loading />;
  }

  const statItems = [
    {
      name: 'Admin Challans',
      count: stats.adminChallans,
      link: '/admin/update-challan',
      color: 'bg-blue-600',
      icon: FileText,
    },
    {
      name: 'Buses',
      count: stats.buses,
      link: '/admin/buses',
      color: 'bg-green-600',
      icon: Bus,
    },
    {
      name: 'Drivers',
      count: stats.drivers,
      link: '/admin/drivers',
      color: 'bg-purple-600',
      icon: Users,
    },
    {
      name: 'Notifications',
      count: stats.notifications,
      link: '/admin/notifications',
      color: 'bg-yellow-600',
      icon: Bell,
    },
    {
      name: 'Routes',
      count: stats.routes,
      link: '/admin/routes',
      color: 'bg-red-600',
      icon: Map,
    },
    {
      name: 'Schedules',
      count: stats.schedules,
      link: '/admin/schedules',
      color: 'bg-indigo-600',
      icon: Calendar,
    },
    {
      name: 'Uploaded Challans',
      count: stats.uploadedChallans,
      link: '/admin/uploaded-challan',
      color: 'bg-teal-600',
      icon: Upload,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {statItems.map((item) => (
        <Link href={item.link} key={item.name} className="block">
          <div
            className={`flex items-center rounded-lg p-4 ${item.color} text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg`}
          >
            <item.icon className="mr-3 h-8 w-8" />
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-2xl font-bold">{item.count}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Stats;
