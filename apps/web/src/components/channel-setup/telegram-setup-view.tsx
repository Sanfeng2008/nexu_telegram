import { Input } from "@/components/ui/input";
import { identify, track } from "@/lib/tracking";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  ExternalLink,
  Loader2,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { postApiV1ChannelsTelegramConnect } from "../../../lib/api/sdk.gen";

const TELEGRAM_COLOR = "#229ED9";

const TELEGRAM_SETUP_STEP_KEYS = [
  "telegramSetup.stepCreateBot",
  "telegramSetup.stepGetToken",
  "telegramSetup.stepConnect",
];

export interface TelegramSetupViewProps {
  onConnected: () => void;
  variant?: "page" | "modal";
  disabled?: boolean;
}

export function TelegramSetupView({
  onConnected,
  variant = "page",
  disabled,
}: TelegramSetupViewProps) {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [botToken, setBotToken] = useState("");
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const { data, error } = await postApiV1ChannelsTelegramConnect({
        body: { botToken: botToken.trim() },
      });
      if (error) {
        toast.error(
          (error as { message?: string }).message ??
            t("telegramSetup.connectFailed"),
        );
        return;
      }
      toast.success(
        t("telegramSetup.connectSuccess", {
          botName: data?.teamName ?? "Telegram Bot",
        }),
      );
      track("channel_ready", {
        channel: "telegram",
        channel_type: "telegram_bot",
      });
      identify({ channels_connected: 1 });
      onConnected();
    } catch {
      toast.error(t("telegramSetup.connectFailed"));
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className={variant === "modal" ? "" : ""}>
      {/* Step indicator */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {TELEGRAM_SETUP_STEP_KEYS.map((key, i) => (
          <button
            type="button"
            key={key}
            onClick={() => setActiveStep(i)}
            className="text-left cursor-pointer"
          >
            <div
              className={`h-1 rounded-full transition-all ${
                i <= activeStep ? "bg-[#229ED9]" : "bg-border"
              }`}
            />
            <div
              className={`text-[11px] font-semibold mt-2 transition-all ${
                i === activeStep
                  ? "text-[#229ED9]"
                  : i < activeStep
                    ? "text-text-secondary"
                    : "text-text-muted/50"
              }`}
            >
              {t("telegramSetup.step", { number: i + 1 })}
            </div>
            <div
              className={`text-[10px] mt-0.5 leading-tight transition-all ${
                i === activeStep ? "text-text-secondary" : "text-text-muted/40"
              }`}
            >
              {t(key)}
            </div>
          </button>
        ))}
      </div>

      {/* Step 1: Create Bot */}
      {activeStep === 0 && (
        <div className="p-5 rounded-xl border bg-surface-1 border-border">
          <div className="flex gap-3 items-start mb-4">
            <div
              className="flex justify-center items-center w-8 h-8 rounded-lg text-[12px] font-bold shrink-0"
              style={{ background: `${TELEGRAM_COLOR}1A`, color: TELEGRAM_COLOR }}
            >
              1
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-text-primary">
                {t("telegramSetup.createBotTitle")}
              </h3>
              <p className="text-[12px] text-text-muted mt-1 leading-relaxed">
                {t("telegramSetup.createBotDesc")}
              </p>
            </div>
          </div>
          <div className="ml-11 space-y-3">
            <div className="space-y-2">
              {[
                t("telegramSetup.createStep1"),
                t("telegramSetup.createStep2"),
                t("telegramSetup.createStep3"),
                t("telegramSetup.createStep4"),
              ].map((item, i) => (
                <div key={item} className="flex gap-2.5 items-start">
                  <div className="flex justify-center items-center w-5 h-5 rounded-full bg-surface-3 text-[9px] font-bold text-text-muted shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-[12px] text-text-secondary leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <a
              href="https://t.me/BotFather"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex gap-1.5 items-center px-3.5 py-2 text-[12px] font-medium rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-hover hover:bg-surface-3 transition-all"
            >
              <ExternalLink size={12} />
              {t("telegramSetup.openBotFather")}
            </a>
          </div>
        </div>
      )}

      {/* Step 2: Get Token */}
      {activeStep === 1 && (
        <div className="p-5 rounded-xl border bg-surface-1 border-border">
          <div className="flex gap-3 items-start mb-4">
            <div
              className="flex justify-center items-center w-8 h-8 rounded-lg text-[12px] font-bold shrink-0"
              style={{ background: `${TELEGRAM_COLOR}1A`, color: TELEGRAM_COLOR }}
            >
              2
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-text-primary">
                {t("telegramSetup.getTokenTitle")}
              </h3>
              <p className="text-[12px] text-text-muted mt-1 leading-relaxed">
                {t("telegramSetup.getTokenDesc")}
              </p>
            </div>
          </div>
          <div className="ml-11 space-y-3">
            <div className="space-y-2">
              {[
                t("telegramSetup.tokenStep1"),
                t("telegramSetup.tokenStep2"),
                t("telegramSetup.tokenStep3"),
              ].map((item, i) => (
                <div key={item} className="flex gap-2.5 items-start">
                  <div className="flex justify-center items-center w-5 h-5 rounded-full bg-surface-3 text-[9px] font-bold text-text-muted shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-[12px] text-text-secondary leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg border border-border bg-surface-0">
              <p className="text-[11px] text-text-muted mb-1.5 font-medium">
                {t("telegramSetup.tokenFormat")}
              </p>
              <code className="text-[12px] font-mono text-text-secondary">
                {"1234567890:AAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}
              </code>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Connect */}
      {activeStep === 2 && (
        <div className="p-5 rounded-xl border bg-surface-1 border-border">
          <div className="flex gap-3 items-start mb-4">
            <div
              className="flex justify-center items-center w-8 h-8 rounded-lg text-[12px] font-bold shrink-0"
              style={{ background: `${TELEGRAM_COLOR}1A`, color: TELEGRAM_COLOR }}
            >
              3
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-text-primary">
                {t("telegramSetup.connectTitle")}
              </h3>
              <p className="text-[12px] text-text-muted mt-1 leading-relaxed">
                {t("telegramSetup.connectDesc")}
              </p>
            </div>
          </div>
          <div className="ml-11 space-y-4">
            <div>
              <div className="flex items-baseline gap-1.5 mb-1.5">
                <label
                  htmlFor="telegram-bot-token"
                  className="text-[12px] text-text-primary font-medium"
                >
                  {t("telegramSetup.botTokenLabel")}
                </label>
                <span className="text-[11px] text-text-muted">
                  {t("telegramSetup.botTokenHint")}
                </span>
              </div>
              <div className="relative">
                <Input
                  id="telegram-bot-token"
                  type="password"
                  placeholder="e.g. 1234567890:AAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  className="text-[13px] font-mono pr-9"
                />
                <Lock
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/40"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleConnect}
              disabled={disabled || connecting || !botToken.trim()}
              className="flex gap-1.5 items-center px-5 py-2.5 text-[13px] font-medium text-white rounded-lg transition-all disabled:opacity-60 cursor-pointer"
              style={{ background: TELEGRAM_COLOR }}
            >
              {connecting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check size={14} />
              )}
              {t("telegramSetup.verifyConnect")}
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-5">
        <button
          type="button"
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          className="flex gap-1.5 items-center text-[12px] text-text-muted hover:text-text-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowLeft size={13} />
          {t("telegramSetup.previous")}
        </button>
        {activeStep < TELEGRAM_SETUP_STEP_KEYS.length - 1 && (
          <button
            type="button"
            onClick={() => setActiveStep(activeStep + 1)}
            className="flex gap-1.5 items-center px-4 py-2 text-[12px] font-medium text-white rounded-lg transition-all cursor-pointer"
            style={{ background: TELEGRAM_COLOR }}
          >
            {t("telegramSetup.next")}
            <ChevronRight size={13} />
          </button>
        )}
      </div>

      {/* Help link */}
      <div className="flex gap-3 items-center p-4 mt-5 rounded-xl border bg-surface-1 border-border">
        <BookOpen size={14} className="shrink-0" style={{ color: TELEGRAM_COLOR }} />
        <p className="text-[11px] text-text-muted leading-relaxed">
          {t("telegramSetup.helpText")}{" "}
          <a
            href="https://core.telegram.org/bots#how-do-i-create-a-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-2 font-medium"
            style={{ color: TELEGRAM_COLOR }}
          >
            {t("telegramSetup.helpLinkText")}
          </a>{" "}
          {t("telegramSetup.helpSuffix")}
        </p>
      </div>
    </div>
  );
}
