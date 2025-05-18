'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/components/Providers';
import { Cog6ToothIcon, KeyIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';

// Available models object
const AVAILABLE_MODELS = {
  gemini: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro", "gemini-pro-vision"],
  claude: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
  openai: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"]
};

export default function SettingsPage() {
  const { apiKeys, setApiKeys, currentModel, setCurrentModel, darkMode, toggleDarkMode } = useAppContext();
  
  const [formKeys, setFormKeys] = useState({
    googleApiKey: '',
    anthropicApiKey: '',
    openaiApiKey: ''
  });

  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'claude' | 'openai'>('gemini');
  const [selectedModel, setSelectedModel] = useState<string>(currentModel);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  
  // Initialize form with stored API keys
  useEffect(() => {
    setFormKeys({
      googleApiKey: apiKeys.googleApiKey || '',
      anthropicApiKey: apiKeys.anthropicApiKey || '',
      openaiApiKey: apiKeys.openaiApiKey || ''
    });
  }, [apiKeys]);
  
  // Handle API key form changes
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormKeys(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save API keys
  const saveApiKeys = async () => {
    setIsSaving(true);
    
    try {
      // In a real implementation, this would save to backend
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update context
      setApiKeys({
        googleApiKey: formKeys.googleApiKey,
        anthropicApiKey: formKeys.anthropicApiKey,
        openaiApiKey: formKeys.openaiApiKey
      });
      
      setSavedMessage('API keys saved successfully');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (error) {
      console.error('Error saving API keys:', error);
      setSavedMessage('Error saving API keys');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Save model settings
  const saveModelSettings = () => {
    setIsSaving(true);
    
    try {
      // Format the model string as expected by the backend (provider:model)
      const formattedModelString = `${selectedProvider}:${selectedModel}`;
      setCurrentModel(formattedModelString);
      
      setSavedMessage('Model settings saved successfully');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (error) {
      console.error('Error saving model settings:', error);
      setSavedMessage('Error saving model settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* Model Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Cog6ToothIcon className="h-6 w-6 mr-2 text-primary-600" />
          Model Settings
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Provider</label>
          <div className="grid grid-cols-3 gap-3">
            {Object.keys(AVAILABLE_MODELS).map((provider) => (
              <button
                key={provider}
                onClick={() => {
                  setSelectedProvider(provider as any);
                  // Set first model of this provider as selected
                  setSelectedModel(AVAILABLE_MODELS[provider as keyof typeof AVAILABLE_MODELS][0]);
                }}
                className={`py-2 px-4 rounded-md text-center transition-colors ${
                  selectedProvider === provider
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 border border-primary-300 dark:border-primary-700'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          >
            {AVAILABLE_MODELS[selectedProvider]?.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={saveModelSettings}
          disabled={isSaving}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Model Settings'}
        </button>
      </div>
      
      {/* API Keys */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <KeyIcon className="h-6 w-6 mr-2 text-primary-600" />
          API Keys
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="googleApiKey" className="block text-sm font-medium mb-1">
              Google API Key
            </label>
            <input
              type="password"
              id="googleApiKey"
              name="googleApiKey"
              value={formKeys.googleApiKey}
              onChange={handleApiKeyChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            />
          </div>
          
          <div>
            <label htmlFor="anthropicApiKey" className="block text-sm font-medium mb-1">
              Anthropic API Key
            </label>
            <input
              type="password"
              id="anthropicApiKey"
              name="anthropicApiKey"
              value={formKeys.anthropicApiKey}
              onChange={handleApiKeyChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            />
          </div>
          
          <div>
            <label htmlFor="openaiApiKey" className="block text-sm font-medium mb-1">
              OpenAI API Key
            </label>
            <input
              type="password"
              id="openaiApiKey"
              name="openaiApiKey"
              value={formKeys.openaiApiKey}
              onChange={handleApiKeyChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={saveApiKeys}
            disabled={isSaving}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save API Keys'}
          </button>
        </div>
      </div>
      
      {/* Appearance Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 relative"
          >
            <div
              className={`absolute w-5 h-5 rounded-full bg-white flex items-center justify-center transition-transform ${
                darkMode ? 'translate-x-6 bg-primary-600' : 'translate-x-0'
              }`}
            >
              {darkMode ? (
                <MoonIcon className="h-3 w-3 text-white" />
              ) : (
                <SunIcon className="h-3 w-3 text-yellow-500" />
              )}
            </div>
          </button>
        </div>
      </div>
      
      {/* Success message */}
      {savedMessage && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          {savedMessage}
        </div>
      )}
    </div>
  );
}
