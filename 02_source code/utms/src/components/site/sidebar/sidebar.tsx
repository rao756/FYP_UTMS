'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Calendar,
  LogOut,
  Users,
  FileText,
  Upload,
  Edit,
  ClipboardList,
  BarChart,
} from 'lucide-react';
import React from 'react';
import TransportIcon from '../logo/siteLogo';
import Notifications from '@/components/admin/notifications/notifications';
import { Separator } from '@/components/ui/separator';

const commonLinks = [
  { label: 'Home', link: '/dashboard', icon: Home },
  {
    label: 'Generate Challan',
    link: '/dashboard/generateChallan',
    icon: Calendar,
  },
  { label: 'Upload Challan', link: '/dashboard/uploadChallan', icon: Upload },
];

const adminLinks = [
  
  {
    label: 'Update Challan',
    link: '/dashboard/admin/update-challan',
    icon: Edit,
  },
  {
    label: 'Uploaded Challan',
    link: '/dashboard/admin/uploaded-challan',
    icon: Upload,
  },
  { label: 'Users', link: '/dashboard/admin/users', icon: Users },
  {
    label: 'User Requests',
    link: '/dashboard/admin/user-requests',
    icon: ClipboardList,
  },
];

const accordionLinks = [
  { label: 'Schedules', link: '/dashboard/schedule', icon: Calendar },
  { label: 'Buses', link: '/dashboard/admin/buses', icon: Users },
  { label: 'Routes', link: '/dashboard/admin/routes', icon: Users },
  { label: 'Drivers', link: '/dashboard/admin/drivers', icon: Users },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session }: any = useSession();
  const isAdmin = session?.user?.type === 'admin';

  const navigationLinks = isAdmin
    ? [...commonLinks, ...accordionLinks, ...adminLinks]
    : [
        ...commonLinks,
        { label: 'Schedules', link: '/dashboard/schedule', icon: Calendar },
      ];

  return (
    <Card className="flex h-full w-[70px] flex-col justify-between rounded-xl border border-input bg-card/80 md:w-[300px]">
      {!session ? (
        <></>
      ) : (
        <>
          <div className="p-2">
            <CardHeader className="flex-col items-center justify-between gap-4 rounded-xl bg-white p-2 md:flex-row md:gap-0">
              <Link href={'/'}>
                <CardTitle className="flex w-full items-center gap-2 text-center text-primary">
                  <TransportIcon />

                  <h2 className="title-font hidden bg-gradient-to-r from-[#79e946] to-primary bg-clip-text text-xl font-bold tracking-wide text-transparent md:inline md:text-start md:text-3xl">
                    UTMS
                  </h2>
                </CardTitle>
              </Link>
            </CardHeader>
          </div>
          <CardContent className="h-auto p-2 md:p-4">
            <div className="flex h-full w-full flex-col items-center justify-center md:items-start">
              {commonLinks.map((item, index) => {
                const isActive = pathname === item.link;
                const Icon = item.icon;
                
                return  (
                  <div
                    className={`grid w-full place-content-center items-center justify-center gap-4 px-3 py-2.5 transition-all duration-300 md:flex md:justify-start ${
                      isActive
                        ? 'rounded-md bg-primary font-semibold text-white dark:text-black'
                        : 'hover:bg-secondary hover:text-primary'
                    }`}
                    key={index}
                  >
                    <Link
                      href={item.link}
                      key={item.label}
                      className="flex w-full gap-2"
                    >
                      <Icon size={20} />
                      <span className="hidden md:inline">{item.label}</span>
                    </Link>
                  </div>
                );
              })}
      {isAdmin &&              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="transport-links">
                  <AccordionTrigger className={`w-full gap-2 px-3 py-2.5`}>
                    <div className="flex gap-2">
                      <Calendar size={20} />
                      <span>Transport</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="rounded-2xl bg-white p-2">
                    <div className="flex h-full w-full flex-col items-center justify-center md:items-start">
                      {accordionLinks.map((item, index) => {
                        const isActive = pathname === item.link;
                        const Icon = item.icon;

                        return (
                          <div
                            className={`grid w-full place-content-center items-center justify-center gap-4 px-3 py-2.5 transition-all duration-300 md:flex md:justify-start ${
                              isActive
                                ? 'rounded-md bg-primary font-semibold text-white dark:text-black'
                                : 'hover:bg-secondary hover:text-primary'
                            }`}
                            key={index}
                          >
                            <Link
                              href={item.link}
                              key={item.label}
                              className="flex w-full gap-2"
                            >
                              <Icon size={20} />
                              <span className="hidden text-base md:inline">
                                {item.label}
                              </span>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>}
              {isAdmin &&
                adminLinks.map((item, index) => {
                  const isActive = pathname === item.link;
                  const Icon = item.icon;

                  return (
                    <div
                      className={`grid w-full place-content-center items-center justify-center gap-4 px-3 py-2.5 transition-all duration-300 md:flex md:justify-start ${
                        isActive
                          ? 'rounded-md bg-primary font-semibold text-white dark:text-black'
                          : 'hover:bg-secondary hover:text-primary'
                      }`}
                      key={index}
                    >
                      <Link
                        href={item.link}
                        key={item.label}
                        className="flex w-full gap-2"
                      >
                        <Icon size={20} />
                        <span className="hidden md:inline">{item.label}</span>
                      </Link>
                    </div>
                  );
                })}
              <Separator className="my-2 bg-primary" />
              <Notifications />
            </div>
          </CardContent>
          <CardFooter className="flex-row items-center justify-between p-2">
            <Button
              variant={'outline'}
              className="w-full"
              onClick={async () => {
                await signOut({ redirect: false });
                router.push('/login');
              }}
            >
              <LogOut size={20} />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default Sidebar;
