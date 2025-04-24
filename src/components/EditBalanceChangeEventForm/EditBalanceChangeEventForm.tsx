import React, { FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import { FormattedMessage } from 'react-intl';

import classes from './EditBalanceChangeEventForm.module.scss';

import {
  ButtonWithPreviewHintAndLabel,
  CheckboxInput,
  CommentEditor,
  ModuleTabs,
  Tag,
} from 'components';
import { CurrencyEditorContainer, DateEditorContainer, WeekDaysInputContainer } from 'containers';

interface EditBalanceChangeEventFormProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  changeDateTab: (index: number) => void;
  changeRepeatable: (event: React.ChangeEvent<HTMLInputElement>) => void;
  commentary: string;
  currencyValue: number | null;
  date?: string;
  initialDateTab: number;
  onWeekDayCheckboxChange: (index: number, value: boolean) => void;
  repeatCycleTab: number;
  repeatable: boolean;
  selectedWeekDays: boolean[];
  setCommentary: (value: string) => void;
  setCurrencyValue: (value: number | null) => void;
  setDate: (value: string) => void;
  setRepeatCycleTab: (value: number) => void;
  setRepeatable: (value: boolean) => void;
  type: 'source' | 'drain';
}

export const EditBalanceChangeEventForm: FC<EditBalanceChangeEventFormProps> = ({
  changeDateTab,
  changeRepeatable,
  className,
  commentary,
  currencyValue,
  date,
  initialDateTab,
  onWeekDayCheckboxChange,
  repeatCycleTab,
  repeatable,
  selectedWeekDays,
  setCommentary,
  setCurrencyValue,
  setDate,
  setRepeatCycleTab,
  setRepeatable,
  type,
  ...restProps
}) => {
  return (
    <div className={cn(classes.container, className)} {...restProps}>
      <CommentEditor defaultValue={commentary} onChange={setCommentary}>
        {commentary}
      </CommentEditor>
      <hr />

      <CurrencyEditorContainer
        defaultValue={currencyValue}
        onChange={setCurrencyValue}
        label={
          type === 'source' ? (
            <FormattedMessage id="currency-editor.income.label" defaultMessage="Income" />
          ) : (
            <FormattedMessage id="currency-editor.expenses.label" defaultMessage="Expenses" />
          )
        }
      />
      <hr />

      <ModuleTabs
        captions={[
          <FormattedMessage id="balance-change-event.repeat.today.label" defaultMessage="Today" />,
          <FormattedMessage
            id="balance-change-event.repeat.other-day.label"
            defaultMessage="Other Day"
          />,
        ]}
        initialTabSelected={initialDateTab}
        onChange={changeDateTab}
        content={[
          <ButtonWithPreviewHintAndLabel
            label={<FormattedMessage id="balance-change-event.date.label" defaultMessage="Date" />}>
            {date}
          </ButtonWithPreviewHintAndLabel>,

          <>
            <DateEditorContainer date={date} onSelect={setDate}>
              {date}
            </DateEditorContainer>

            <CheckboxInput onChange={changeRepeatable} checked={repeatable}>
              <FormattedMessage id="balance-change-event.repeat.label" defaultMessage="Repeat" />
            </CheckboxInput>

            {repeatable && (
              <ModuleTabs
                captions={[
                  <FormattedMessage
                    id="balance-change-event.repeat.monthly.label"
                    defaultMessage="Monthly"
                  />,
                  <FormattedMessage
                    id="balance-change-event.repeat.weekly.label"
                    defaultMessage="Weekly"
                  />,
                ]}
                initialTabSelected={repeatCycleTab}
                onChange={setRepeatCycleTab}
                content={[
                  null,

                  <>
                    <Tag className={classes.daysOfWeekTag}>
                      <FormattedMessage
                        id="balance-change-event.repeat.weekly.schedule.label"
                        defaultMessage="Days of week"
                      />
                    </Tag>

                    <WeekDaysInputContainer
                      selection={selectedWeekDays}
                      onCheckboxChange={onWeekDayCheckboxChange}
                    />
                  </>,
                ]}
              />
            )}
          </>,
        ]}
      />
    </div>
  );
};
