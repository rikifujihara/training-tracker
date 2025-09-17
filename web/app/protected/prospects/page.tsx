"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { ProspectCard } from "@/components/prospects/prospect-card";
import { NotesSidePane } from "@/components/prospects/notes-side-pane";

import {
  useInfiniteLeads,
  useLeadStats,
  useProspectFilterCounts,
  usePrefetchLeadsFilters,
  useSearchLeads,
} from "@/lib/hooks/use-leads";
import { useTasks } from "@/lib/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Lead, LeadStatus } from "@/lib/types/lead";
import { NotebookPen } from "lucide-react";
import { ProspectSearchBar } from "@/components/prospects/prospect-search-bar";

type ProspectFilter = "today" | "overdue" | "upcoming" | "all";

export default function ProspectsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProspectFilter>("today");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Initialize prefetching
  const { prefetchAllFilters } = usePrefetchLeadsFilters(10);

  // Use different queries based on whether we're searching or filtering
  const isSearching = activeFilter === "all" && searchQuery.trim().length > 0;

  const {
    data: leadsData,
    isLoading: leadsLoading,
    error: leadsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteLeads(activeFilter, 10, LeadStatus.PROSPECT);

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
    fetchNextPage: fetchSearchNextPage,
    hasNextPage: searchHasNextPage,
    isFetchingNextPage: searchIsFetchingNextPage,
  } = useSearchLeads(searchQuery, 10, LeadStatus.PROSPECT, isSearching);

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
    if (isSearching) {
      return searchData?.pages.flatMap((page) => page.leads) || [];
    }
    return leadsData?.pages.flatMap((page) => page.leads) || [];
  }, [leadsData, searchData, isSearching]);

  // Since filtering is now done server-side, we just use the leads directly
  const filteredProspects = allLeads;

  // Determine which loading state and pagination to use
  const currentLoading = isSearching ? searchLoading : leadsLoading;
  const currentError = isSearching ? searchError : leadsError;
  const currentHasNextPage = isSearching ? searchHasNextPage : hasNextPage;
  const currentIsFetchingNextPage = isSearching ? searchIsFetchingNextPage : isFetchingNextPage;
  const currentFetchNextPage = isSearching ? fetchSearchNextPage : fetchNextPage;

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
        return "Due Later";
      case "all":
        return "Search";
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

  // Reset search query when switching away from "all" filter
  React.useEffect(() => {
    if (activeFilter !== "all") {
      setSearchQuery("");
    }
  }, [activeFilter]);

  // Search handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedLead(null);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedLead(null);
  };

  // Intersection observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && currentHasNextPage && !currentIsFetchingNextPage) {
          currentFetchNextPage();
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
  }, [currentHasNextPage, currentIsFetchingNextPage, currentFetchNextPage]);

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

  if (currentError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error loading leads: {currentError.message}
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

          {/* Search Bar - Only show when "Search" filter is active */}
          {activeFilter === "all" && (
            <div className="mt-4">
              <ProspectSearchBar
                onSearch={handleSearch}
                onClear={handleClearSearch}
                isLoading={currentLoading}
                placeholder="Search prospects by name or phone number..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Prospects Content */}
      {currentLoading ? (
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
            {currentHasNextPage && (
              <div ref={loadMoreRef} className="flex justify-center pt-4">
                <Button
                  onClick={() => currentFetchNextPage()}
                  disabled={currentIsFetchingNextPage}
                  variant="outline"
                  size="default"
                >
                  {currentIsFetchingNextPage ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}

            {/* Loading indicator for auto-loading */}
            {currentIsFetchingNextPage && (
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
                {activeFilter === "all" && isSearching
                  ? "No search results"
                  : activeFilter === "all" && !isSearching
                  ? "Search prospects"
                  : `No ${getFilterLabel(activeFilter).toLowerCase()} prospects`}
              </h3>
              <p className="text-text-disabled text-[16px] leading-[24px]">
                {activeFilter === "today" ? (
                  "No prospects have tasks due today."
                ) : activeFilter === "overdue" ? (
                  "Great! No overdue tasks for prospects."
                ) : activeFilter === "upcoming" ? (
                  "No prospects have upcoming tasks."
                ) : activeFilter === "all" && isSearching ? (
                  `No prospects found matching "${searchQuery}". Try a different search term.`
                ) : activeFilter === "all" && !isSearching ? (
                  "Use the search bar above to find prospects by name or phone number."
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
