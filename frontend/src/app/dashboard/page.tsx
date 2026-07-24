import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebinarFeedbackForm from "@/components/webinars/WebinarFeedbackForm";
import WebinarCountdown from "@/components/webinars/WebinarCountdown";
import DashboardWebinars from "@/components/webinars/DashboardWebinars";
import Link from "next/link";
import { 
  Heart, BookOpen, Award, Users, Video, Calendar, Clock, 
  MapPin, ShieldCheck, Download, ExternalLink, Activity, Bell, ListTodo,
  Building2, Briefcase, CheckCircle, Ribbon
} from "lucide-react";

export const revalidate = 0; // Fresh dashboard information on every visit

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const now = new Date();

  // Fetch Institution Data if applicable
  let institutionData: any = null;
  if (user.role === "ORGANIZATION_MEMBER") {
    institutionData = await db.organizationMember.findFirst({
      where: { email: user.email || "" }
    });
  } else if (user.role === "CORPORATE_PARTNER") {
    institutionData = await db.corporatePartner.findFirst({
      where: { email: user.email || "" }
    });
  }

  // If user is approved organization or corporate, return the Institution Dashboard
  if (user.role === "ORGANIZATION_MEMBER" || user.role === "CORPORATE_PARTNER") {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen text-slate-800 bg-slate-50 font-sans">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-pink-100 pb-6 bg-white p-6 rounded-3xl shadow-xs">
          <div className="flex items-center gap-4">
            {institutionData?.organizationLogoUrl || institutionData?.companyLogoUrl ? (
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-sm bg-slate-50 flex items-center justify-center p-1">
                <img 
                  src={user.role === "ORGANIZATION_MEMBER" ? institutionData.organizationLogoUrl : institutionData.companyLogoUrl} 
                  alt="Logo" 
                  className="max-h-full max-w-full object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="h-16 w-16 bg-pink-100 text-pink-700 flex items-center justify-center rounded-2xl text-xl font-bold font-heading shrink-0 shadow-sm border border-pink-200">
                {institutionData?.organizationName?.[0] || institutionData?.companyName?.[0] || "I"}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {user.role === "ORGANIZATION_MEMBER" ? institutionData?.organizationName : institutionData?.companyName}
                </h1>
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Certified Partner
                </span>
              </div>
              <p className="text-muted-foreground text-sm font-medium mt-1">
                Active Partnership Account • Contact Person: <strong className="text-slate-700">{institutionData?.contactPersonName}</strong> ({institutionData?.designation})
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <Link href="/campaigns/membership">
              <Button variant="outline" className="border-pink-200 text-slate-700 hover:bg-pink-50 rounded-xl font-bold cursor-pointer">
                View Membership Info
              </Button>
            </Link>
            <a href="mailto:partnerships@grsawareness.org">
              <Button className="bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer">
                Contact Strategic Desk
              </Button>
            </a>
          </div>
        </div>

        {/* Grid: Partnership Certificate & Profile Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Partnership Certificate Card (Left 2 columns) */}
          <div className="lg:col-span-2">
            <Card className="border-pink-100 bg-white shadow-lg rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between h-full group hover:shadow-xl transition-all duration-300">
              
              {/* Certificate Outer Border */}
              <div className="absolute inset-4 border-2 border-dashed border-pink-200 rounded-2xl pointer-events-none" />
              
              {/* Corner graphics decoration */}
              <div className="absolute top-8 right-8 opacity-5">
                <Ribbon className="h-32 w-32 text-rose-500" />
              </div>

              <div className="space-y-6 relative z-10 text-center py-6">
                <div className="flex justify-center mb-2">
                  <Ribbon className="h-10 w-10 text-primary animate-pulse" />
                </div>
                
                <h2 className="font-heading text-2xl font-black text-slate-800 tracking-wider">
                  CERTIFICATE OF STRATEGIC PARTNERSHIP
                </h2>
                
                <p className="text-slate-500 font-semibold italic text-xs uppercase tracking-widest border-y border-pink-100 py-2 max-w-sm mx-auto">
                  GRS Breast Cancer Awareness Mission
                </p>

                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                  This certificate is proudly issued to honor our valued institutional collaborator:
                </p>

                <h3 className="font-heading text-3xl font-black text-slate-900 tracking-tight my-4">
                  {user.role === "ORGANIZATION_MEMBER" ? institutionData?.organizationName : institutionData?.companyName}
                </h3>

                <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
                  for their strategic commitment and dedicated efforts in organizing joint breast cancer awareness campaigns, screening drives, employee wellness initiatives, and community advocacy.
                </p>
              </div>

              {/* Certificate Bottom sign-offs */}
              <div className="relative z-10 grid grid-cols-3 items-end pt-8 border-t border-slate-100 text-[10px] text-slate-500 font-semibold max-w-lg mx-auto w-full text-center">
                <div>
                  <span className="block border-b border-slate-200 pb-1 mb-1 font-bold text-slate-700">
                    {institutionData?.ngoRegistrationNumber || institutionData?.gstNumber}
                  </span>
                  ID REGISTERED
                </div>
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full border border-pink-100 bg-pink-50/50 flex items-center justify-center text-[10px] font-bold text-primary font-heading shadow-xs">
                    GRS SEAL
                  </div>
                </div>
                <div>
                  <span className="block border-b border-slate-200 pb-1 mb-1 font-bold font-heading text-slate-700 italic">
                    Antigravity AI
                  </span>
                  GRS COORDINATOR
                </div>
              </div>
            </Card>
          </div>

          {/* Profile metadata Card (Right 1 column) */}
          <div className="col-span-1 space-y-6">
            
            {/* Institution Profile Info */}
            <Card className="border-slate-100 rounded-3xl bg-white shadow-sm p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-heading font-black text-lg text-slate-800 flex items-center gap-1.5">
                  <Activity className="h-5 w-5 text-primary" /> Institution Data
                </h3>
              </div>
              
              <div className="space-y-3.5 text-xs">
                {user.role === "ORGANIZATION_MEMBER" ? (
                  <>
                    <div><span className="text-slate-400 font-bold block uppercase text-[9px]">NGO Registration Number</span><strong>{institutionData?.ngoRegistrationNumber}</strong></div>
                    <div><span className="text-slate-400 font-bold block uppercase text-[9px]">Established Year</span><strong>{institutionData?.yearEstablished}</strong></div>
                    <div><span className="text-slate-400 font-bold block uppercase text-[9px]">Organization Type</span><strong>{institutionData?.organizationType}</strong></div>
                    <div><span className="text-slate-400 font-bold block uppercase text-[9px]">Volunteer Strength</span><strong>{institutionData?.numberOfVolunteers} Volunteers</strong></div>
                    <div><span className="text-slate-400 font-bold block uppercase text-[9px]">Primary Areas of Work</span><strong>{institutionData?.areasOfWork}</strong></div>
                  </>
                ) : (
                  <>
                    <div><span className="text-slate-400 font-bold block uppercase text-[9px]">GST Number</span><strong>{institutionData?.gstNumber}</strong></div>
                    {institutionData?.cinNumber && <div><span className="text-slate-400 font-bold block uppercase text-[9px]">CIN Number</span><strong>{institutionData?.cinNumber}</strong></div>}
                    <div><span className="text-slate-400 font-bold block uppercase text-[9px]">Industry Segment</span><strong>{institutionData?.industry}</strong></div>
                    <div><span className="text-slate-400 font-bold block uppercase text-[9px]">Employee Strength</span><strong>{institutionData?.employeeStrength} Employees</strong></div>
                    <div><span className="text-slate-400 font-bold block uppercase text-[9px]">CSR Budget Category</span><strong>{institutionData?.csrBudgetCategory}</strong></div>
                  </>
                )}

                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">Partner Email</span>
                  <strong>{institutionData?.email}</strong>
                </div>

                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">HQ Address</span>
                  <strong>{user.role === "ORGANIZATION_MEMBER" ? institutionData?.completeAddress : institutionData?.companyAddress}</strong>
                </div>

                {institutionData?.remarks && (
                  <div className="bg-pink-50/50 border border-pink-100 p-3 rounded-xl">
                    <span className="text-pink-700 font-bold block uppercase text-[9px]">Coordinator Remarks</span>
                    <p className="mt-1 italic text-slate-600">{institutionData.remarks}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Collaboration Hub / Initiative Center */}
        <div className="space-y-4 pt-4">
          <div className="space-y-1">
            <h3 className="font-heading font-black text-xl text-slate-800">
              Partnership Initiative Hub
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Access utilities and coordinate drives directly with the Breast Cancer awareness committee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <Card className="border-slate-100 hover:border-pink-300 hover:shadow-md transition-all duration-300 rounded-2xl bg-white p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-slate-800 text-base">Request Awareness Camp</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Request doctors and oncology panels to host localized screening and self-examination camps at your facility.
                </p>
              </div>
              <Button onClick={() => alert("Awareness camp scheduling portal is opening soon. Contact partnerships@grsawareness.org.")} className="bg-slate-100 hover:bg-pink-50 hover:text-primary text-slate-700 font-bold text-xs py-2 w-full rounded-xl cursor-pointer">
                Request Camp Setup
              </Button>
            </Card>

            {/* Card 2 */}
            <Card className="border-slate-100 hover:border-pink-300 hover:shadow-md transition-all duration-300 rounded-2xl bg-white p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-slate-800 text-base">Download Kits & Flyers</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Get high-resolution Breast Self-Examination (BSE) graphics, posters, training guides, and regional flyers.
                </p>
              </div>
              <Button onClick={() => alert("Downloading media kit... (Flyers, infographics, checkup guides)")} className="bg-slate-100 hover:bg-pink-50 hover:text-primary text-slate-700 font-bold text-xs py-2 w-full rounded-xl cursor-pointer">
                Download Media Kit
              </Button>
            </Card>

            {/* Card 3 */}
            <Card className="border-slate-100 hover:border-pink-300 hover:shadow-md transition-all duration-300 rounded-2xl bg-white p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-slate-800 text-base">Schedule Wellness Webinar</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Setup an online webinar stream exclusively for your volunteers, employees, or local community, featuring clinical specialists.
                </p>
              </div>
              <Button onClick={() => alert("Webinar schedule requests form will be unlocked. Please contact support.")} className="bg-slate-100 hover:bg-pink-50 hover:text-primary text-slate-700 font-bold text-xs py-2 w-full rounded-xl cursor-pointer">
                Request Webinar
              </Button>
            </Card>

            {/* Card 4 */}
            <Card className="border-slate-100 hover:border-pink-300 hover:shadow-md transition-all duration-300 rounded-2xl bg-white p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-slate-800 text-base">Fundraising Campaigns</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Co-sponsor local diagnostic checkups and treatments. Set up matching corporate donor channels or direct fundraising drives.
                </p>
              </div>
              <Button onClick={() => alert("Sponsorship allocation and CSR donation channels are active at /donate. Direct fundraisers can be registered through patient profiles.")} className="bg-slate-100 hover:bg-pink-50 hover:text-primary text-slate-700 font-bold text-xs py-2 w-full rounded-xl cursor-pointer">
                Open Donation Portal
              </Button>
            </Card>

          </div>
        </div>

      </div>
    );
  }

  // Fetch Webinar Registrations
  const registrations = await db.webinarRegistration.findMany({
    where: { userId: user.id },
    include: {
      webinar: {
        include: {
          registrations: true,
        }
      }
    },
    orderBy: { registeredAt: "desc" },
  });

  // Fetch Attendance Records
  const attendanceLogs = await db.attendance.findMany({
    where: { userId: user.id },
    include: { webinar: true },
    orderBy: { createdAt: "desc" },
  });

  // Fetch Certificates
  const certificates = await db.certificate.findMany({
    where: { recipientId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // Segregate webinars into Upcoming, Live, and Past
  const liveWebinars = registrations.filter(r => {
    const start = new Date(r.webinar.startTime);
    const end = new Date(r.webinar.endTime);
    return now >= start && now <= end && r.webinar.status === "PUBLISHED";
  });

  const upcomingWebinars = registrations.filter(r => {
    const start = new Date(r.webinar.startTime);
    return now < start && r.webinar.status === "PUBLISHED";
  });

  const pastWebinars = registrations.filter(r => {
    const end = new Date(r.webinar.endTime);
    return now > end || r.webinar.status === "COMPLETED";
  });

  // Dynamic notifications list
  const notifications: { title: string; message: string; date: Date; type: string }[] = [];
  
  registrations.forEach(r => {
    const start = new Date(r.webinar.startTime);
    const end = new Date(r.webinar.endTime);

    // 1. Registration Successful
    notifications.push({
      title: "Registration Successful",
      message: `You are officially registered for "${r.webinar.title}". Join details will unlock on ${start.toLocaleDateString("en-US")}.`,
      date: r.registeredAt,
      type: "SUCCESS"
    });

    // 2. Reminder 24 hours before
    const oneDayMs = 24 * 60 * 60 * 1000;
    const timeDiffMs = start.getTime() - now.getTime();
    if (timeDiffMs > 0 && timeDiffMs < oneDayMs) {
      notifications.push({
        title: "Reminder: 24 Hours Left",
        message: `"${r.webinar.title}" will start in less than 24 hours at ${start.toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit'})}.`,
        date: new Date(start.getTime() - oneDayMs),
        type: "WARNING"
      });
    }

    // 3. Reminder 1 hour before
    const oneHourMs = 60 * 60 * 1000;
    if (timeDiffMs > 0 && timeDiffMs < oneHourMs) {
      notifications.push({
        title: "Reminder: 1 Hour Left",
        message: `"${r.webinar.title}" will start in less than 1 hour! Get ready to join.`,
        date: new Date(start.getTime() - oneHourMs),
        type: "WARNING"
      });
    }

    // 4. Webinar Live
    if (now >= start && now <= end && r.webinar.status === "PUBLISHED") {
      notifications.push({
        title: "Webinar Live Now",
        message: `"${r.webinar.title}" is currently live streaming! Join now to track attendance and receive your certificate.`,
        date: start,
        type: "LIVE"
      });
    }
  });

  // 5. Certificate Ready
  certificates.forEach(c => {
    notifications.push({
      title: "Certificate Ready",
      message: `Congratulations! Your cryptographic attendance certificate for "${c.eventName}" is ready to download.`,
      date: c.createdAt,
      type: "CERTIFICATE"
    });
  });

  // Sort notifications by date desc
  notifications.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6 min-h-screen">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-pink-100 pb-6">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
            Welcome back, {user.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your breast cancer mission dashboard as a <span className="text-primary font-bold uppercase tracking-wider">{user.role}</span>
          </p>
        </div>
        <div className="flex gap-2">
          {user.role === "ADMIN" && (
            <Link href="/admin/webinars">
              <Button className="bg-primary text-white hover:bg-primary/90 font-bold rounded-xl transition-all">
                Go to Webinar Command Center
              </Button>
            </Link>
          )}
          <Link href="/webinars">
            <Button variant="outline" className="border-pink-200 text-slate-700 hover:bg-pink-50 rounded-xl font-bold">
              Browse Webinars
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Tab System */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-pink-50/50 border border-pink-100/50 p-1 rounded-xl">
          <TabsTrigger value="overview" className="font-bold text-xs uppercase py-2">
            <ListTodo className="h-4 w-4" /> Activity Overview
          </TabsTrigger>
          <TabsTrigger value="webinars" className="font-bold text-xs uppercase py-2">
            <Video className="h-4 w-4" /> Webinars ({registrations.length})
          </TabsTrigger>
          <TabsTrigger value="certificates" className="font-bold text-xs uppercase py-2">
            <Award className="h-4 w-4" /> Certificates ({certificates.length})
          </TabsTrigger>
          <TabsTrigger value="attendance" className="font-bold text-xs uppercase py-2">
            <Activity className="h-4 w-4" /> Attendance Logs
          </TabsTrigger>
          <TabsTrigger value="notifications" className="font-bold text-xs uppercase py-2 relative">
            <Bell className="h-4 w-4" /> Alerts
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 rounded-3xl border border-pink-50 shadow-sm">
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
              <CardDescription>View your records, notifications, and approvals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-pink-50/10 border border-pink-100/50 text-sm">
                <p className="font-bold text-slate-800">Verification Status: Active</p>
                <p className="text-muted-foreground mt-1">
                  Your account is verified. You can access all features configured for your role on the network.
                </p>
              </div>
              
              {user.role === "VOLUNTEER" && (
                <div className="space-y-2 text-sm pt-2">
                  <p className="font-semibold text-primary flex items-center gap-1.5"><Award className="h-4 w-4" /> Earned Certificates</p>
                  <p className="text-muted-foreground">Complete the breast cancer awareness quiz or attend certified webinars to earn downloadable QR-verified certificates.</p>
                  <Link href="/learn/quiz" className="block"><Button variant="outline" size="sm" className="rounded-xl border-pink-200">Go to Quiz Engine</Button></Link>
                </div>
              )}

              {user.role === "PATIENT" && (
                <div className="space-y-2 text-sm pt-2">
                  <p className="font-semibold text-primary flex items-center gap-1.5"><Heart className="h-4 w-4" /> My Campaigns</p>
                  <p className="text-muted-foreground">No active crowdfunding campaigns found. Upload medical bills and request NGO endorsements to start fundraising.</p>
                  <Link href="/campaigns/create" className="block"><Button variant="outline" size="sm" className="rounded-xl border-pink-200">Create Campaign</Button></Link>
                </div>
              )}

              {user.role === "DOCTOR" && (
                <div className="space-y-2 text-sm pt-2">
                  <p className="font-semibold text-primary flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> Medical Publications</p>
                  <p className="text-muted-foreground">Publish oncologist-verified guidelines and physical test schedules to raise public awareness.</p>
                  <Link href="/learn/articles" className="block"><Button variant="outline" size="sm" className="rounded-xl border-pink-200">Write Article</Button></Link>
                </div>
              )}

              {user.role === "NGO_REP" && (
                <div className="space-y-2 text-sm pt-2">
                  <p className="font-semibold text-primary flex items-center gap-1.5"><Users className="h-4 w-4" /> Endorsement Requests</p>
                  <p className="text-muted-foreground">Audit patient registration files and verify bank accounts to endorse fundraising campaigns.</p>
                  <Link href="/dashboard" className="block"><Button variant="outline" size="sm" className="rounded-xl border-pink-200">View Verification Queue</Button></Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-pink-50 shadow-sm">
            <CardHeader>
              <CardTitle>Support & Assistance</CardTitle>
              <CardDescription>Support center & guidelines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              <p>
                If you have issues verifying your doctor credentials, registering NGO registration certificates, or setting up Razorpay donations, please contact the Support Desk.
              </p>
              <p className="font-bold text-slate-800">
                Support email: support@grsawareness.org
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Webinars Sub-dashboard */}
        <TabsContent value="webinars" className="space-y-6">
          <Card className="rounded-3xl border border-pink-50 shadow-sm bg-white/50 backdrop-blur-xs">
            <CardHeader className="border-b border-pink-50 pb-5">
              <CardTitle>My Registered Webinars</CardTitle>
              <CardDescription>Track upcoming live timers, join meetings, and access completed records.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <DashboardWebinars
                registrations={registrations}
                certificates={certificates}
                attendanceLogs={attendanceLogs}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Certificates Center */}
        <TabsContent value="certificates">
          <Card className="rounded-3xl border border-pink-50 shadow-sm">
            <CardHeader>
              <CardTitle>My Certificates</CardTitle>
              <CardDescription>View, download, or verify your verifiably signed attendance credentials.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {certificates.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Award className="h-10 w-10 text-pink-200 mx-auto stroke-[1.5]" />
                  <p className="text-xs text-slate-500">You haven't earned any certificates yet.</p>
                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">Attend a certified live webinar for at least 80% duration to unlock your cryptographic certificate here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map(cert => (
                    <div key={cert.id} className="border border-pink-100 rounded-2xl p-5 bg-white/70 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between space-y-4">
                      
                      {/* Small graphics decoration */}
                      <div className="absolute top-4 right-4 opacity-5">
                        <Award className="h-16 w-16 text-rose-500" />
                      </div>

                      <div>
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                          QR Verified
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm mt-2 line-clamp-1">{cert.eventName}</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Speaker: {cert.speakerName || "Medical Expert"}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">ID: {cert.certificateIdString}</p>
                      </div>

                      <div className="flex gap-2 border-t border-slate-100 pt-3">
                        <Link href={`/api/certificates/${cert.id}/download`}>
                          <Button size="sm" className="bg-primary hover:bg-primary/95 text-white rounded-xl text-[10px] uppercase font-bold py-1.5 h-auto px-4 shadow-sm flex items-center gap-1">
                            <Download className="h-3 w-3" /> Download PDF
                          </Button>
                        </Link>
                        <Link href={`/verify/${cert.certificateIdString}`} target="_blank">
                          <Button size="sm" variant="outline" className="border-pink-200 text-slate-700 hover:bg-pink-50 rounded-xl text-[10px] uppercase font-semibold py-1.5 h-auto px-3 flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" /> Verify QR
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Attendance Logs */}
        <TabsContent value="attendance">
          <Card className="rounded-3xl border border-pink-50 shadow-sm">
            <CardHeader>
              <CardTitle>Attendance History & Credit Logs</CardTitle>
              <CardDescription>Review your join time, duration percentages, and verification states.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 overflow-x-auto">
              {attendanceLogs.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">You have no attendance logs captured yet.</p>
              ) : (
                <table className="w-full text-xs text-left text-slate-500 border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-400 font-bold">
                      <th className="py-2.5">Webinar Name</th>
                      <th className="py-2.5">Join Time</th>
                      <th className="py-2.5">Leave Time</th>
                      <th className="py-2.5 text-center">Duration</th>
                      <th className="py-2.5 text-center">Percentage</th>
                      <th className="py-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {attendanceLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="py-3 font-bold text-slate-800">{log.webinar.title}</td>
                        <td className="py-3">{log.joinTime ? new Date(log.joinTime).toLocaleString() : "-"}</td>
                        <td className="py-3">{log.leaveTime ? new Date(log.leaveTime).toLocaleString() : "Active Session"}</td>
                        <td className="py-3 text-center">{log.durationMinutes.toFixed(1)} mins</td>
                        <td className="py-3 text-center font-mono font-bold text-slate-700">{log.attendancePercentage.toFixed(0)}%</td>
                        <td className="py-3 text-right">
                          <span className={`inline-block px-2.5 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                            log.status === "PRESENT" || log.status === "Completed"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : "bg-red-50 text-red-500 border border-red-100"
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Alerts / Notifications */}
        <TabsContent value="notifications">
          <Card className="rounded-3xl border border-pink-50 shadow-sm">
            <CardHeader>
              <CardTitle>System Notifications & Alerts</CardTitle>
              <CardDescription>Track webinar times, certificates ready, and registration approvals.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">Your inbox is empty.</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif, i) => (
                    <div key={i} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex justify-between items-start gap-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block h-2 w-2 rounded-full ${
                            notif.type === "SUCCESS" ? "bg-blue-500" : notif.type === "WARNING" ? "bg-amber-500" : "bg-primary"
                          }`} />
                          <h4 className="font-bold text-slate-800">{notif.title}</h4>
                        </div>
                        <p className="text-slate-500 pl-4">{notif.message}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{new Date(notif.date).toLocaleDateString("en-US")}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
