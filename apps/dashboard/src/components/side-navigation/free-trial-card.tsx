import { LogoCircle } from '../icons';
import { RiArrowRightDoubleLine, RiInformationFill } from 'react-icons/ri';
import { Progress } from '../primitives/progress';
import { Button } from '../primitives/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipArrow } from '../primitives/tooltip';
import { LEGACY_ROUTES, ROUTES } from '@/utils/routes';
import { Link } from 'react-router-dom';
import { useFeatureFlag } from '@/hooks/use-feature-flag';
import { FeatureFlagsKeysEnum } from '@novu/shared';
import { useFetchSubscription } from '@/hooks/use-fetch-subscription';

const transition = 'transition-all duration-300 ease-out';

const pluralizeDaysLeft = (numberOfDays: number) => {
  return `${numberOfDays} day${numberOfDays > 1 ? 's' : ''}`;
};

const CardContent = ({
  pluralizedDays,
  daysTotal,
  daysLeft,
}: {
  pluralizedDays: string;
  daysTotal: number;
  daysLeft: number;
}) => (
  <>
    <div className="flex items-center gap-1.5">
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-full bg-neutral-700 ${transition} group-hover:bg-neutral-0`}
      >
        <LogoCircle className={`h-3 w-3 ${transition} group-hover:h-4 group-hover:w-4`} />
      </div>
      <span className="text-foreground-950 text-sm">{pluralizedDays} left on trial</span>
      <Tooltip>
        <TooltipTrigger className="ml-auto">
          <span className="relative flex size-4 items-center justify-center">
            <RiArrowRightDoubleLine
              className={`text-foreground-400 size-4 opacity-100 ${transition} group-hover:opacity-0`}
            />
            <RiInformationFill
              className={`text-foreground-400 absolute left-0 top-0 size-4 opacity-0 ${transition} group-hover:opacity-100`}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent variant="light" size="lg" side="right" className="w-48">
          <TooltipArrow variant="light" className="-translate-y-[1px]" />
          <span className="text-foreground-600 text-xs">
            After the trial ends, continue to enjoy novu's free tier with unlimited workflows and up to 30k
            events/month.
          </span>
        </TooltipContent>
      </Tooltip>
    </div>
    <span className="text-foreground-600 text-xs">
      Enjoy unlimited access to Novu for free for the next {pluralizedDays}.
    </span>
    <div className={`max-h-3 overflow-hidden opacity-100 ${transition} group-hover:max-h-0 group-hover:opacity-0`}>
      <Progress value={daysTotal - daysLeft} max={daysTotal} />
    </div>
    <div
      className={`-mt-2 max-h-0 overflow-hidden opacity-0 ${transition} group-hover:max-h-8 group-hover:opacity-100`}
    >
      <Button className={`w-full translate-y-full ${transition} group-hover:translate-y-0`} variant="light" size="sm">
        Upgrade now
      </Button>
    </div>
  </>
);

export const FreeTrialCard = () => {
  const { subscription, daysLeft, isLoading } = useFetchSubscription();
  const daysTotal = subscription && subscription.trial.daysTotal > 0 ? subscription.trial.daysTotal : 100;
  const isV2BillingEnabled = useFeatureFlag(FeatureFlagsKeysEnum.IS_V2_DASHBOARD_BILLING_ENABLED);

  if (isLoading || !subscription || !subscription.trial.isActive || subscription?.hasPaymentMethod) {
    return null;
  }

  const pluralizedDays = pluralizeDaysLeft(daysLeft);
  const cardClassName =
    'bg-background group relative left-2 mb-2 flex w-[calc(100%-1rem)] cursor-pointer flex-col gap-2 rounded-lg p-3 shadow';

  if (isV2BillingEnabled) {
    return (
      <Link to={ROUTES.SETTINGS_BILLING} className={cardClassName}>
        <CardContent pluralizedDays={pluralizedDays} daysTotal={daysTotal} daysLeft={daysLeft} />
      </Link>
    );
  }

  return (
    <a href={LEGACY_ROUTES.BILLING} className={cardClassName}>
      <CardContent pluralizedDays={pluralizedDays} daysTotal={daysTotal} daysLeft={daysLeft} />
    </a>
  );
};
