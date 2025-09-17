import * as React from "react";
import { ContactHistoryCard } from "../contact-history-card";
import { ContactPointWithTemplate } from "@/lib/types/contactPoint";
import { Consultation } from "@/lib/types/consultation";
import { formatDateAustralian } from "@/lib/utils/date";

interface ContactHistoryProps {
  variant: "modal" | "sidepane";
  contactPoints: ContactPointWithTemplate[];
  consultations?: Consultation[];
  contactPointsLoading: boolean;
  consultationsLoading: boolean;
}

export function ContactHistory({
  variant,
  contactPoints,
  consultations,
  contactPointsLoading,
  consultationsLoading,
}: ContactHistoryProps) {
  const sectionClasses =
    variant === "modal"
      ? "bg-surface-primary p-3 rounded-lg space-y-3"
      : "bg-surface-primary p-4 rounded-lg space-y-4";

  // Combine contact points and consultations for chronological display
  const allHistoryItems = React.useMemo(() => {
    const items: Array<{
      type: "contact" | "consultation";
      data: ContactPointWithTemplate | Consultation;
      date: Date;
    }> = [];

    // Add contact points
    contactPoints.forEach((cp) => {
      items.push({
        type: "contact",
        data: cp,
        date: new Date(cp.createdAt),
      });
    });

    // Add consultations
    consultations?.forEach((consultation) => {
      items.push({
        type: "consultation",
        data: consultation,
        date: new Date(consultation.scheduledTime),
      });
    });

    // Sort by date (most recent first)
    return items.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [contactPoints, consultations]);

  if (contactPointsLoading || consultationsLoading) {
    return (
      <div className={sectionClasses}>
        <h3 className="text-lg font-semibold">Contact History</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-muted rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={sectionClasses}>
      <h3 className="text-lg font-semibold">Contact History</h3>

      {allHistoryItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            No contact history yet. Start by making a call or sending a text.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {allHistoryItems.map((item) => {
            if (item.type === "contact") {
              const contactPoint = item.data as ContactPointWithTemplate;
              return (
                <ContactHistoryCard
                  key={`contact-${contactPoint.id}`}
                  id={contactPoint.id}
                  contactType={contactPoint.contactType}
                  outcome={contactPoint.outcome}
                  contactDate={contactPoint.createdAt}
                  notes={contactPoint.notes}
                  messageTemplate={contactPoint.messageTemplate}
                  showNotes={true}
                  showOutcomeBadge={true}
                />
              );
            } else {
              // Render consultation item
              const consultation = item.data as Consultation;
              return (
                <div
                  key={`consultation-${consultation.id}`}
                  className="bg-blue-50 border border-blue-200 rounded-md p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-900">
                        Consultation Scheduled
                      </span>
                    </div>
                    <span className="text-xs text-blue-700">
                      {formatDateAustralian(consultation.scheduledTime)}
                    </span>
                  </div>
                  {consultation.notes && (
                    <p className="text-sm text-blue-800 mt-2">
                      {consultation.notes}
                    </p>
                  )}
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
