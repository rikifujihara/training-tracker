"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { ProspectCard } from "@/components/prospects/prospect-card";
import { NotesSidePane } from "@/components/prospects/notes-side-pane";

import {
  useInfiniteLeads,
  useLeadStats,
  useProspectFilterCounts,
  usePrefetchLeadsFilters,
} from "@/lib/hooks/use-leads";
import { useTasks } from "@/lib/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Lead, LeadStatus } from "@/lib/types/lead";
import { NotebookPen } from "lucide-react";

type ProspectFilter = "today" | "overdue" | "upcoming" | "all";

export default function ProspectsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProspectFilter>("today");

  // Initialize prefetching
  const { prefetchAllFilters } = usePrefetchLeadsFilters(10);

  const {
    data: leadsData,
    isLoading: leadsLoading,
    error: leadsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteLeads(activeFilter, 10, LeadStatus.PROSPECT);

  const { isLoading: statsLoading } = useLeadStats();

  // Fetch filter counts for all filters
  const { data: filterCounts, isLoading: filterCountsLoading } =
    useProspectFilterCounts(LeadStatus.PROSPECT);

  // Fetch all tasks to determine next actions (we still need this for the action labels)
  const { isLoading: tasksLoading } = useTasks();

  // Prefetch all filters on component mount
  useEffect(() => {
    // Only prefetch once filter counts are loaded
    if (filterCounts) {
      prefetchAllFilters(LeadStatus.PROSPECT).catch(console.error);
    }
  }, [filterCounts, prefetchAllFilters]);

  // Flatten all leads from all pages
  const allLeads = useMemo(() => {
    return leadsData?.pages.flatMap((page) => page.leads) || [];
  }, [leadsData]);

  // Since filtering is now done server-side, we just use the leads directly
  const filteredProspects = allLeads;

  // Get filter counts from the dedicated filter counts query
  const getFilterCount = (filter: ProspectFilter): number => {
    if (!filterCounts) return 0;

    switch (filter) {
      case "today":
        return filterCounts.today;
      case "overdue":
        return filterCounts.overdue;
      case "upcoming":
        return filterCounts.upcoming;
      case "all":
        return filterCounts.all;
      default:
        return 0;
    }
  };

  const getFilterLabel = (filter: ProspectFilter): string => {
    switch (filter) {
      case "today":
        return "Due Today";
      case "overdue":
        return "Overdue";
      case "upcoming":
        return "Upcoming";
      case "all":
        return "All Prospects";
      default:
        return "";
    }
  };

  // Set the first lead as selected by default when filtered prospects change
  React.useEffect(() => {
    if (filteredProspects.length > 0) {
      setSelectedLead(filteredProspects[0]);
    } else {
      setSelectedLead(null);
    }
  }, [filteredProspects]);

  // Reset selected lead when filter changes
  React.useEffect(() => {
    setSelectedLead(null);
  }, [activeFilter]);

  // Intersection observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleShowNotes = (lead: Lead) => {
    setSelectedLead(lead);
  };

  // Show initial loading only if essential data is loading
  if (statsLoading || tasksLoading || filterCountsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (leadsError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error loading leads: {leadsError.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-text-headings text-[20px] leading-[24px] font-semibold">
            Follow ups
          </h2>
          <div className="flex flex-wrap gap-3 max-sm:flex-col-reverse">
            {(["today", "overdue", "upcoming", "all"] as ProspectFilter[]).map(
              (filter) => {
                const count = getFilterCount(filter);
                const isActive = activeFilter === filter;

                return (
                  <Button
                    key={filter}
                    variant={isActive ? "default" : "secondary"}
                    size="default"
                    onClick={() => setActiveFilter(filter)}
                    className={`flex items-center gap-2 max-sm:w-full ${
                      isActive
                        ? "bg-surface-action text-text-on-action hover:bg-surface-action/90"
                        : ""
                    }`}
                  >
                    <span>{getFilterLabel(filter)}</span>
                    <Badge
                      variant={
                        filter === "overdue" ? "destructive" : "secondary"
                      }
                      className={`${
                        isActive
                          ? "bg-white/20 text-white hover:bg-white/30"
                          : ""
                      }`}
                    >
                      {count}
                    </Badge>
                  </Button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Prospects Content */}
      {leadsLoading ? (
        // Show loading skeletons for prospects content
        <div className="flex gap-6 max-sm:justify-center">
          <div className="space-y-4 flex-shrink-0">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse w-80">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Notes Side Pane - Desktop Only */}
          <div className="hidden lg:block min-w-[400px] w-full">
            <div className="sticky top-6 h-[calc(100vh-120px)]">
              <Card className="animate-pulse h-full">
                <CardHeader>
                  <div className="h-5 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-20 bg-muted rounded w-full"></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : filteredProspects.length > 0 ? (
        <div className="flex gap-6 max-sm:justify-center">
          <div className="space-y-4 flex-shrink-0 max-sm:w-full">
            {filteredProspects.map((lead) => (
              <ProspectCard
                key={lead.id}
                lead={lead}
                onShowNotes={handleShowNotes}
                selectedForNotes={selectedLead?.id === lead.id}
              />
            ))}

            {/* Load More Button and Intersection Observer Target */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="flex justify-center pt-4">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="outline"
                  size="default"
                >
                  {isFetchingNextPage ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}

            {/* Loading indicator for auto-loading */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <div className="text-text-disabled">
                  Loading more prospects...
                </div>
              </div>
            )}
          </div>
          {/* Notes Side Pane - Desktop Only */}
          <div className="hidden lg:block min-w-[400px] w-full">
            <div className="sticky top-6 h-[calc(100vh-120px)]">
              {selectedLead ? (
                <NotesSidePane lead={selectedLead} />
              ) : (
                <div className="w-full h-full bg-surface-primary rounded-lg border border-border-primary flex items-center justify-center">
                  <div className="text-center text-text-disabled">
                    <NotebookPen className="w-12 h-12 mx-auto mb-4 text-text-disabled/50" />
                    <p className="text-lg font-medium">Select a prospect</p>
                    <p className="text-sm">
                      to view their notes and contact history
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="text-text-headings text-[18px] leading-[22px] font-semibold mb-2">
                No {getFilterLabel(activeFilter).toLowerCase()} prospects
              </h3>
              <p className="text-text-disabled text-[16px] leading-[24px]">
                {activeFilter === "today" ? (
                  "No prospects have tasks due today."
                ) : activeFilter === "overdue" ? (
                  "Great! No overdue tasks for prospects."
                ) : activeFilter === "upcoming" ? (
                  "No prospects have upcoming tasks."
                ) : allLeads && allLeads.length === 0 ? (
                  <>
                    No leads yet.{" "}
                    <a
                      href="/protected/upload-leads"
                      className="underline text-surface-action"
                    >
                      Upload your first leads
                    </a>
                  </>
                ) : (
                  "All prospects are shown above."
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
