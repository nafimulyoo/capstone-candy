"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Download,
  MousePointer,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TagCloud } from "react-tagcloud";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";

// Define the types to match your backend schemas
interface SessionItem {
  date: string;
  count: number;
}

interface SatisfactionItem {
  date: string;
  rate: number;
  positive: number;
  negative: number;
}

interface ResponseTimeItem {
  date: string;
  average_time: number;
}

interface TopicItem {
  [topic: string]: number;
}

interface SummaryData {
  total_sessions: number;
  sessions_change: number;
  total_cta: number;
  cta_change: number;
  total_leads: number;
  leads_change: number;
  avg_satisfaction: number;
  satisfaction_change: number;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function Analytics() {
  const [timePeriod, setTimePeriod] = useState<"daily" | "monthly" | "yearly">("monthly");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 5, 1),
    to: new Date(2025, 5, 6),
  });

  const [sessionsData, setSessionsData] = useState<SessionItem[]>([]);
  const [leadsData, setLeadsData] = useState<SessionItem[]>([]);
  const [satisfactionData, setSatisfactionData] = useState<SatisfactionItem[]>([]);
  const [responseTimeData, setResponseTimeData] = useState<ResponseTimeItem[]>([]);
  const [topicsData, setTopicsData] = useState<TopicItem | null>(null);  // Allow null
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const start = dateRange?.from?.toISOString().split("T")[0];
      const end = dateRange?.to?.toISOString().split("T")[0];

      console.log("Fetching data with date range:", start, end);
      try {
        const baseUrl = BACKEND_URL; // Define base URL here
        const sessionUrl = `${baseUrl}/analytics/sessions?range=${timePeriod}&start=${start}&end=${end}`;
        const leadsUrl = `${baseUrl}/analytics/cta-clicks?range=${timePeriod}&start=${start}&end=${end}`;
        const satisfactionUrl = `${baseUrl}/analytics/satisfaction?range=${timePeriod}&start=${start}&end=${end}`;
        const responseTimesUrl = `${baseUrl}/analytics/response-times?range=${timePeriod}&start=${start}&end=${end}`;
        const topicsUrl = `${baseUrl}/analytics/topics?start=${start}&end=${end}`;
        const summaryUrl = `${baseUrl}/analytics/summary?range=${timePeriod}&start=${start}&end=${end}`;

        const [
          sessionsResponse,
          leadsResponse,
          satisfactionResponse,
          responseTimeResponse,
          topicsResponse,
          summaryResponse,
        ] = await Promise.all([
          fetch(sessionUrl, {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`,},}).then((res) => res.json()),
          fetch(leadsUrl, {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`,},}).then((res) => res.json()),
          fetch(satisfactionUrl, {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`,},}).then((res) => res.json()),
          fetch(responseTimesUrl, {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`,},}).then((res) => res.json()),
          fetch(topicsUrl, {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`,},}).then((res) => res.json()), 
          fetch(summaryUrl, {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`,},}).then((res) => res.json()),
        ]);

        setSessionsData(sessionsResponse.data);
        setLeadsData(leadsResponse.data);
        setSatisfactionData(satisfactionResponse.data);
        setResponseTimeData(responseTimeResponse.data);
        setTopicsData(topicsResponse.topics);
        setSummaryData(summaryResponse);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please check the console.");
      } finally {
        setLoading(false);
      }
    };

    if (dateRange?.from && dateRange?.to) {
      fetchData();
    }
  }, [timePeriod, dateRange]);

  // Function to transform topicsData into the format needed for the tag cloud
  const transformTopicsData = (topics: TopicItem | null) => {
    if (!topics) {
      return [];  // Return empty array if topics is null or undefined
    }
    return Object.entries(topics).map(([topic, count]) => ({
      value: topic,
      count: count,
    }));
  };

  // Use the transformed data
  const wordCloudData = transformTopicsData(topicsData);

  // Custom renderer for word cloud tags
  const customRenderer = (tag: any, size: number, color: string) => (
    <span
      key={tag.value}
      style={{
        fontSize: `${size}px`,
        color,
        margin: "3px",
        padding: "3px",
        display: "inline-block",
        backgroundColor: `rgba(66, 153, 225, ${tag.count / 50})`,
        borderRadius: "5px",
      }}
    >
      {tag.value}
    </span>
  );


  const totalSessions = summaryData?.total_sessions || 0;
  const sessionsChange = summaryData?.sessions_change || 0;
  const totalLeads = summaryData?.total_leads || 0;
  const leadsChange = summaryData?.leads_change || 0;
  const totalCTA = summaryData?.total_cta || 0;
  const ctaChange = summaryData?.cta_change || 0;
  const avgSatisfaction = summaryData?.avg_satisfaction || 0;
  const satisfactionChange = summaryData?.satisfaction_change || 0;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="grid gap-2">
            <Label htmlFor="from-date">From</Label>
            <Input
              type="date"
              id="from-date"
              value={dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                setDateRange((prev) => ({
                  from: date || undefined,
                  to: prev?.to || date || undefined,
                }));
              }}
              className="w-[200px]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="to-date">To</Label>
            <Input
              type="date"
              id="to-date"
              value={dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                setDateRange((prev) => ({
                  from: prev?.from || date || undefined,
                  to: date || undefined,
                }));
              }}
              className="w-[200px]"
            />
          </div>
          <div className="grid gap-1">
            <Label>Group data by</Label>
            <RadioGroup
              defaultValue="monthly"
              className="flex space-x-1 -pt-1"
              onValueChange={setTimePeriod}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly">Yearly</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>
      {

        
      }

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p
              className={`text-xs flex items-center mt-2 ${
                sessionsChange > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {sessionsChange > 0 ? "+" : ""}
              {sessionsChange}% from the previous month
              {sessionsChange > 0 ? (
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
            </p>
            <p className="text-xs mt-2 text-gray-500">
              A session is a unique chat conversation initiated by a user
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <User className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>

            <p
              className={`text-xs flex mt-2 items-center ${
                leadsChange > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {leadsChange > 0 ? "+" : ""}
              {leadsChange}% from the previous month
              {leadsChange > 0 ? (
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
            </p>
            <p className="text-xs mt-2 text-gray-500">
              A lead is a chat session where the user provides their contact
              information
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total CTA</CardTitle>
            <MousePointer className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCTA}</div>

            <p
              className={`text-xs flex items-center mt-2 ${
                ctaChange > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {ctaChange > 0 ? "+" : ""}
              {ctaChange}% from the previous month
              {ctaChange > 0 ? (
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              CTA represents the total number of call-to-action buttons clicked
              by users from the chatbot
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Satisfaction Rate
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSatisfaction}%</div>

            <p
              className={`text-xs flex items-center mt-2 ${
                satisfactionChange > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {satisfactionChange > 0 ? "+" : ""}
              {satisfactionChange}% from the previous month
              {satisfactionChange > 0 ? (
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Satisfaction represents the percentage of 'like' responses out of
              all 'like' and 'dislike' responses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {timePeriod === "daily"
                ? "Daily Sessions"
                : timePeriod === "monthly"
                ? "Monthly Sessions"
                : "Yearly Sessions"}
            </CardTitle>
            <CardDescription>
              {timePeriod === "daily"
                ? "Number of daily chat sessions initiated over the time period."
                : timePeriod === "monthly"
                ? "Number of monthly chat sessions initiated over the time period."
                : "Number of yearly chat sessions initiated over the time period."}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sessionsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")}
                />
                <Legend />
                <Line
                  name="Active Users"
                  type="monotone"
                  dataKey="count"
                  stroke="#3182CE"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {timePeriod === "daily"
                ? "Daily Call to Action Clicks"
                : timePeriod === "monthly"
                ? "Monthly Call to Action Clicks"
                : "Yearly Call to Action Clicks"}
            </CardTitle>
            <CardDescription>
              {timePeriod === "daily"
                ? "Daily call to action click over the time period"
                : timePeriod === "monthly"
                ? "Monthly call to action clicks over the time period"
                : "Yearly call to action clicks over the time period"}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={leadsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")}
                />
                <Legend />
                <Line
                  name="CTA clicks"
                  type="monotone"
                  dataKey="count"
                  stroke="#3182CE"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {timePeriod === "daily"
                ? "Daily User Satisfaction"
                : timePeriod === "monthly"
                ? "Monthly User Satisfaction"
                : "Yearly User Satisfaction"}
            </CardTitle>
            <CardDescription>
              {timePeriod === "daily"
                ? "Daily average user satisfaction rate for chat responses over the time period."
                : timePeriod === "monthly"
                ? "Monthly user satisfaction rate for chat responses over the time period."
                : "Yearly user satisfaction rate for chat responses over the time period."}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={satisfactionData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")}
                />
                <Legend />
                <Line
                  name="User Satisfaction (%)"
                  type="monotone"
                  dataKey="rate"
                  stroke="#3182CE"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {timePeriod === "daily"
                ? "Daily Average Response Time"
                : timePeriod === "monthly"
                ? "Monthly Average Response Time"
                : "Yearly Average Response Time"}
            </CardTitle>
            <CardDescription>
              {timePeriod === "daily"
                ? "Daily average response time of the chatbot over the time period."
                : timePeriod === "monthly"
                ? "Monthly average response time of the chatbot over the time period."
                : "Yearly average response time of the chatbot over the time period."}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={responseTimeData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")}
                />
                <Legend />
                <Line
                  name="Response Time (s)"
                  type="monotone"
                  dataKey="average_time"
                  stroke="#FF0000"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Popular Topics</CardTitle>
          <CardDescription>Most frequently asked topics</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <div className="flex items-center justify-center h-full">
            <TagCloud
              minSize={12}
              maxSize={35}
              tags={wordCloudData}
              className="w-full h-full flex flex-wrap justify-center items-center"
              renderer={customRenderer}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
