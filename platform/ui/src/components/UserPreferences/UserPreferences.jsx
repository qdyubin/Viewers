import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select, Typography, Button, HotkeysPreferences } from '@ohif/ui';
import i18n from '@ohif/i18n';
import { useTranslation } from 'react-i18next';
const { availableLanguages, defaultLanguage, currentLanguage } = i18n;

const UserPreferences = ({ hotkeyDefaults, hotkeyDefinitions, onCancel, onSubmit, onReset }) => {
  const [state, setState] = useState({ isDisabled: false, hotkeyErrors: {}, hotkeyDefinitions, language: currentLanguage });
  const { t } = useTranslation('UserPreferencesModal');

  const onSubmitHandler = () => {
    i18n.changeLanguage(state.language);
    onSubmit(state);
  };

  const onResetHandler = () => {
    setState(state => ({ ...state, language: defaultLanguage }));
    resetHotkeyDefinitions();
    onReset();
  };

  const onCancelHandler = () => {
    setState({ hotkeyDefinitions, language: currentLanguage });
    onCancel();
  };

  const resetHotkeyDefinitions = () => {
    const defaultHotkeyDefinitions = {};

    hotkeyDefaults.map(hotkey => {
      const { commandName, ...values } = hotkey;
      defaultHotkeyDefinitions[commandName] = { ...values };
    });

    setState(state => ({ ...state, hotkeyDefinitions: defaultHotkeyDefinitions }));
  };

  const onHotkeysChangeHandler = (id, definition, errors) => {
    setState(state => ({
      ...state,
      isDisabled: Object.values(errors).every(e => e !== undefined),
      hotkeyErrors: errors,
      hotkeyDefinitions: {
        ...state.hotkeyDefinitions,
        [id]: definition,
      }
    }));
  };

  const Section = ({ title, children }) => (
    <>
      <div className="border-b-2 border-black mb-2">
        <Typography
          variant="h5"
          className="flex flex-grow text-primary-light font-light pb-2"
        >
          {title}
        </Typography>
      </div>
      <div className="mt-4 mb-8">
        {children}
      </div>
    </>
  );

  return (
    <div className="p-2">
      <Section title="General">
        <div className="flex flex-row justify-center items-center w-72">
          <Typography variant="subtitle" className="mr-5 text-right h-full">
            Language
          </Typography>
          <Select
            isClearable={false}
            onChange={value => setState(state => ({ ...state, language: value }))}
            options={availableLanguages}
            value={state.language}
          />
        </div>
      </Section>
      <Section title="Hotkeys">
        <HotkeysPreferences
          hotkeyDefinitions={state.hotkeyDefinitions}
          onChange={onHotkeysChangeHandler}
          errors={state.hotkeyErrors}
        />
      </Section>
      <div className="flex flex-row justify-between">
        <Button variant="outlined" onClick={onResetHandler}>
          {t('Reset to Defaults')}
        </Button>
        <div className="flex flex-row">
          <Button variant="outlined" onClick={onCancelHandler}>
            {t('Cancel')}
          </Button>
          <Button
            variant="contained"
            disabled={state.isDisabled}
            color="light"
            className="ml-2"
            onClick={onSubmitHandler}
          >
            {t('Save')}
          </Button>
        </div>
      </div>
    </div>
  );
};

const noop = () => { };

UserPreferences.propTypes = {
  hotkeyDefaults: PropTypes.array.isRequired,
  hotkeyDefinitions: PropTypes.object.isRequired,
  languageOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ),
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  onReset: PropTypes.func,
};

UserPreferences.defaultProps = {
  languageOptions: [
    { value: 'ONE', label: 'ONE' },
    { value: 'TWO', label: 'TWO' },
  ],
  onCancel: noop,
  onSubmit: noop,
  onReset: noop,
};

export default UserPreferences;
