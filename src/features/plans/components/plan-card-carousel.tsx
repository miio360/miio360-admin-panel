import { PlanCardVideo } from './plan-cards/PlanCardVideo';
import { PlanCardAdvertising } from './plan-cards/PlanCardAdvertising';
import { PlanCardLives } from './plan-cards/PlanCardLives';
import { PlanCardEmptyState } from './plan-cards/PlanCardEmptyState';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/components/ui/carousel';
import type { VideoPlan, AdvertisingPlan, LivesPlan } from '../types/plan';

interface PlanCardCarouselVideoProps {
  plans: VideoPlan[];
  onEdit: (plan: VideoPlan) => void;
  onToggleActive: (plan: VideoPlan) => void;
  onDelete: (plan: VideoPlan) => void;
}

interface PlanCardCarouselAdvertisingProps {
  plans: AdvertisingPlan[];
  onEdit: (plan: AdvertisingPlan) => void;
  onToggleActive: (plan: AdvertisingPlan) => void;
  onDelete: (plan: AdvertisingPlan) => void;
}

interface PlanCardCarouselLivesProps {
  plans: LivesPlan[];
  onEdit: (plan: LivesPlan) => void;
  onToggleActive: (plan: LivesPlan) => void;
  onDelete: (plan: LivesPlan) => void;
}

export function PlanVideoCardCarousel({
  plans,
  onEdit,
  onToggleActive,
  onDelete,
}: PlanCardCarouselVideoProps) {
  if (plans.length === 0) {
    return <PlanCardEmptyState />;
  }

  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2">
        {plans.map((plan) => (
          <CarouselItem key={plan.id} className="pl-2 basis-full">
            <PlanCardVideo
              plan={plan}
              onEdit={() => onEdit(plan)}
              onToggleActive={() => onToggleActive(plan)}
              onDelete={() => onDelete(plan)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {plans.length > 1 && (
        <>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </>
      )}
    </Carousel>
  );
}

export function PlanAdvertisingCardCarousel({
  plans,
  onEdit,
  onToggleActive,
  onDelete,
}: PlanCardCarouselAdvertisingProps) {
  if (plans.length === 0) {
    return <PlanCardEmptyState />;
  }

  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2">
        {plans.map((plan) => (
          <CarouselItem key={plan.id} className="pl-2 basis-full">
            <PlanCardAdvertising
              plan={plan}
              onEdit={() => onEdit(plan)}
              onToggleActive={() => onToggleActive(plan)}
              onDelete={() => onDelete(plan)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {plans.length > 1 && (
        <>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </>
      )}
    </Carousel>
  );
}

export function PlanLivesCardCarousel({
  plans,
  onEdit,
  onToggleActive,
  onDelete,
}: PlanCardCarouselLivesProps) {
  if (plans.length === 0) {
    return <PlanCardEmptyState />;
  }

  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2">
        {plans.map((plan) => (
          <CarouselItem key={plan.id} className="pl-2 basis-full">
            <PlanCardLives
              plan={plan}
              onEdit={() => onEdit(plan)}
              onToggleActive={() => onToggleActive(plan)}
              onDelete={() => onDelete(plan)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {plans.length > 1 && (
        <>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </>
      )}
    </Carousel>
  );
}
