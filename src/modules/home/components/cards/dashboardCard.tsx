"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { FileCheck, Building2, Briefcase, Handshake } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DashboardStatsCardsProps {
  totalApplications?: number
  totalActiveApplications?: number
  totalInterviews?: number
  totalOffers?: number
}

const statCards = [
  {
    key: "totalApplications",
    title: "Total Users",
    valueKey: "totalApplications" as const,
    icon: Briefcase,
    gradient: "from-violet-500/10 to-purple-500/5 dark:from-violet-500/20 dark:to-purple-500/10",
    iconBg: "bg-violet-500/15 dark:bg-violet-500/25",
    iconColor: "text-violet-600 dark:text-violet-400",
    borderColor: "border-violet-200/50 dark:border-violet-500/20",
  },
  {
    key: "applications",
    title: "Total Active Applications",
    valueKey: "totalActiveApplications" as const,
    icon: FileCheck,
    gradient: "from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/20 dark:to-teal-500/10",
    iconBg: "bg-emerald-500/15 dark:bg-emerald-500/25",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200/50 dark:border-emerald-500/20",
  },
  {
    key: "totalOffers",
    title: "Total Offers",
    valueKey: "totalOffers" as const,
    icon: Handshake,
    gradient: "from-green-500/10 to-lime-500/5 dark:from-green-500/20 dark:to-lime-500/10",
    iconBg: "bg-green-500/15 dark:bg-green-500/25",
    iconColor: "text-green-600 dark:text-green-400",
    borderColor: "border-green-200/50 dark:border-green-500/20",
  },
  // {
  //   key: "companies",
  //   title: "Total Companies",
  //   valueKey: "totalCompanies" as const,
  //   icon: Building2,
  //   gradient: "from-blue-500/10 to-indigo-500/5 dark:from-blue-500/20 dark:to-indigo-500/10",
  //   iconBg: "bg-blue-500/15 dark:bg-blue-500/25",
  //   iconColor: "text-blue-600 dark:text-blue-400",
  //   borderColor: "border-blue-200/50 dark:border-blue-500/20",
  // },
]

export function DashboardStatsCards({
  totalApplications = 0,
  totalActiveApplications = 0,
  totalInterviews = 0,
  totalOffers = 0,
}: DashboardStatsCardsProps) {
  const values = {
    totalApplications,
    totalActiveApplications,
    totalInterviews,
    totalOffers,
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        const value = values[stat.valueKey as keyof typeof values]
        return (
          <Card
            key={stat.key}
            className={cn(
              "relative overflow-hidden border bg-card p-6 shadow-sm transition-all duration-300",
              "hover:shadow-md hover:-translate-y-0.5",
              "animate-in fade-in slide-in-from-bottom-4",
              stat.gradient,
              stat.borderColor
            )}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 min-w-0">
                <p className="text-sm font-medium text-muted-foreground truncate">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
                  {typeof value === "number" ? value.toLocaleString() : value}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                  stat.iconBg,
                  stat.iconColor
                )}
              >
                <Icon className="h-6 w-6" strokeWidth={2} />
              </div>
            </div>
            {/* Subtle bottom accent line */}
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-1 rounded-b-[inherit] opacity-60",
                stat.key === "totalApplications" && "bg-violet-500/30",
                stat.key === "totalActiveApplications" && "bg-emerald-500/30",
                stat.key === "totalInterviews" && "bg-blue-500/30",
                stat.key === "totalOffers" && "bg-green-500/30",
              )}
            />
          </Card>
        )
      })}
    </div>
  )
}
