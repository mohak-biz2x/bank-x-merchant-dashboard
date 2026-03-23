import clsx from "clsx";
import svgPaths from "./svg-ur221wxpmw";

function Wrapper5({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute inset-[30.17%_16.67%]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 9.51899">
        {children}
      </svg>
    </div>
  );
}

function Wrapper4({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute inset-0 overflow-clip" data-name="Style=Default, Direction=Down">
        {children}
      </div>
    </div>
  );
}
type StepProps = {
  additionalClassNames?: string;
};

function Step({ children, additionalClassNames = "" }: React.PropsWithChildren<StepProps>) {
  return (
    <div className={clsx("h-[57px] relative shrink-0 w-full", additionalClassNames)}>
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative size-full">{children}</div>
      </div>
    </div>
  );
}
type Wrapper3Props = {
  additionalClassNames?: string;
};

function Wrapper3({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper3Props>) {
  return (
    <div className={clsx("overflow-clip relative shrink-0", additionalClassNames)}>
      <div className="absolute inset-0 overflow-clip" data-name="Style=Default, Direction=Down">
        <div className="absolute inset-[30.17%_16.67%]" data-name="">
          {children}
        </div>
      </div>
    </div>
  );
}

function Wrapper2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">
      <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#8b8589] text-[14px] whitespace-nowrap">
        <p className="leading-[16px]">{children}</p>
      </div>
    </div>
  );
}

function ButtonsIcon2({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper4>
      <Wrapper5>{children}</Wrapper5>
    </Wrapper4>
  );
}

function Wrapper1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute inset-0 overflow-clip" data-name="Style=Default">
        <div className="absolute inset-[16.67%_22.92%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 16">
            {children}
          </svg>
        </div>
      </div>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]">
      <div className="absolute inset-0 overflow-clip" data-name="Selected=No">
        <div className="absolute inset-[16.67%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.3333 21.3333">
            {children}
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame41832Icon() {
  return (
    <Wrapper>
      <path d={svgPaths.p31e7c780} fill="var(--fill-0, #8B8589)" id="Vector" />
    </Wrapper>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return <Wrapper2>{text}</Wrapper2>;
}

function Buttons1() {
  return (
    <div className="relative rounded-[2px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#36454f] border-solid inset-[-0.5px] pointer-events-none rounded-[2.5px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative">
          <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
            <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#36454f] text-[16px] text-right whitespace-nowrap">
              <p className="leading-[24px]">{"View and update"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
type StatusPillTextProps = {
  text: string;
};

function StatusPillText({ text }: StatusPillTextProps) {
  return (
    <div className="bg-[#e0f8e0] relative rounded-[16px] shrink-0">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] py-[4px] relative">
          <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#36454f] text-[10px] whitespace-nowrap">
            <p className="leading-[16px]">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
type Helper1Props = {
  text: string;
  text1: string;
};

function Helper1({ text, text1 }: Helper1Props) {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#36454f] text-[16px] text-right whitespace-nowrap">
        <p className="leading-[24px]">{text}</p>
      </div>
      <StatusPillText text={text1} />
    </div>
  );
}

function Helper() {
  return (
    <Wrapper4>
      <Wrapper5>
        <path d={svgPaths.p1f4f1080} fill="var(--fill-0, black)" id="ï¸" />
      </Wrapper5>
    </Wrapper4>
  );
}

function ButtonsIcon1() {
  return (
    <Wrapper1>
      <path d={svgPaths.p600ef00} fill="var(--fill-0, #36454F)" id="Vector" />
    </Wrapper1>
  );
}

function ButtonsIcon() {
  return (
    <Wrapper1>
      <path d={svgPaths.p600ef00} fill="var(--fill-0, black)" id="Vector" />
    </Wrapper1>
  );
}
type ButtonsProps = {
  className?: string;
  label?: string;
  leftIcon?: boolean;
  rightIcon?: boolean;
  state?: "Default" | "Hover" | "Pressed" | "Focused" | "Disabled";
  type?: "Default" | "Icon" | "Loader";
  variant?: "Primary" | "Secondary" | "Tertiary";
};

function Buttons({ className, label = "Action", leftIcon = true, rightIcon = true, state = "Default", type = "Default", variant = "Primary" }: ButtonsProps) {
  const isDefaultAndIsPrimaryAndFocusedOrSecondary = type === "Default" && ((variant === "Primary" && state === "Focused") || variant === "Secondary");
  const isDefaultAndIsPrimaryAndHoverOrPrimaryAndPressedOrPrimaryAnd = type === "Default" && ((variant === "Primary" && state === "Hover") || (variant === "Primary" && state === "Pressed") || (variant === "Primary" && state === "Disabled") || (variant === "Tertiary" && state === "Hover") || (variant === "Tertiary" && state === "Pressed") || (variant === "Tertiary" && state === "Focused") || (variant === "Tertiary" && state === "Disabled"));
  const isDefaultAndPrimaryAndDefault = type === "Default" && variant === "Primary" && state === "Default";
  const isDefaultAndPrimaryAndDisabled = type === "Default" && variant === "Primary" && state === "Disabled";
  const isDefaultAndPrimaryAndFocused = type === "Default" && variant === "Primary" && state === "Focused";
  const isDefaultAndPrimaryAndHover = type === "Default" && variant === "Primary" && state === "Hover";
  const isDefaultAndPrimaryAndPressed = type === "Default" && variant === "Primary" && state === "Pressed";
  const isDefaultAndSecondary = type === "Default" && variant === "Secondary";
  const isDefaultAndSecondaryAndDefault = type === "Default" && variant === "Secondary" && state === "Default";
  const isDefaultAndSecondaryAndDisabled = type === "Default" && variant === "Secondary" && state === "Disabled";
  const isDefaultAndSecondaryAndIsDefaultOrFocused = type === "Default" && variant === "Secondary" && ["Default", "Focused"].includes(state);
  const isDefaultAndSecondaryAndIsHoverOrPressed = type === "Default" && variant === "Secondary" && ["Hover", "Pressed"].includes(state);
  const isDefaultAndTertiary = type === "Default" && variant === "Tertiary";
  const isDefaultAndTertiaryAndDefault = type === "Default" && variant === "Tertiary" && state === "Default";
  const isIconAndPrimaryAndFocused = type === "Icon" && variant === "Primary" && state === "Focused";
  const isIconAndSecondary = type === "Icon" && variant === "Secondary";
  const isIconAndSecondaryAndDisabled = type === "Icon" && variant === "Secondary" && state === "Disabled";
  const isIconAndTertiary = type === "Icon" && variant === "Tertiary";
  const isLoaderAndPrimaryAndDefault = type === "Loader" && variant === "Primary" && state === "Default";
  return (
    <div className={className || `relative rounded-[2px] ${isDefaultAndPrimaryAndHover ? "bg-[#2b2b2b] cursor-pointer" : state === "Focused" && ((type === "Icon" && variant === "Secondary") || (type === "Icon" && variant === "Tertiary") || (type === "Default" && variant === "Secondary") || (type === "Default" && variant === "Tertiary")) ? "bg-[#ff7f50]" : state === "Pressed" && ((type === "Icon" && variant === "Secondary") || (type === "Icon" && variant === "Tertiary") || (type === "Default" && variant === "Secondary") || (type === "Default" && variant === "Tertiary")) ? "bg-[#fffff0]" : (type === "Icon" && variant === "Secondary" && state === "Default") || (type === "Icon" && variant === "Secondary" && state === "Hover") || isIconAndSecondaryAndDisabled || (type === "Icon" && variant === "Tertiary" && state === "Default") || (type === "Icon" && variant === "Tertiary" && state === "Disabled") || (type === "Icon" && variant === "Tertiary" && state === "Hover") || isDefaultAndSecondaryAndDefault || isDefaultAndSecondaryAndDisabled || (type === "Default" && variant === "Secondary" && state === "Hover") || isDefaultAndTertiaryAndDefault || (type === "Default" && variant === "Tertiary" && state === "Hover") || (type === "Default" && variant === "Tertiary" && state === "Disabled") ? "" : variant === "Primary" && ((type === "Icon" && state === "Hover") || (type === "Icon" && state === "Pressed") || (type === "Icon" && state === "Focused") || (type === "Default" && state === "Pressed") || (type === "Default" && state === "Focused")) ? "bg-[#2b2b2b]" : variant === "Primary" && state === "Disabled" && ["Icon", "Default"].includes(type) ? "bg-[#f0f0f0]" : isLoaderAndPrimaryAndDefault ? "bg-[#c0c0c0]" : "bg-[#36454f]"}`}>
      <div aria-hidden={isIconAndPrimaryAndFocused || isIconAndSecondary || isDefaultAndPrimaryAndFocused || isDefaultAndSecondary ? "true" : undefined} className={isDefaultAndSecondaryAndIsHoverOrPressed ? "absolute border border-[#2b2b2b] border-solid inset-[-0.5px] pointer-events-none rounded-[2.5px]" : isDefaultAndSecondaryAndDisabled ? "absolute border border-[#d3d3d3] border-solid inset-[-0.5px] pointer-events-none rounded-[2.5px]" : isDefaultAndSecondaryAndIsDefaultOrFocused ? "absolute border border-[#36454f] border-solid inset-[-0.5px] pointer-events-none rounded-[2.5px]" : isIconAndSecondaryAndDisabled ? "absolute border border-[#d3d3d3] border-solid inset-0 pointer-events-none rounded-[2px]" : type === "Icon" && variant === "Secondary" && ["Hover", "Pressed"].includes(state) ? "absolute border border-[#2b2b2b] border-solid inset-0 pointer-events-none rounded-[2px]" : type === "Icon" && variant === "Secondary" && ["Default", "Focused"].includes(state) ? "absolute border border-[#36454f] border-solid inset-0 pointer-events-none rounded-[2px]" : variant === "Primary" && state === "Focused" && ["Icon", "Default"].includes(type) ? "absolute border-2 border-[#ff7f50] border-solid inset-0 pointer-events-none rounded-[2px]" : "flex flex-row items-center size-full"}>
        {((variant === "Primary" && state === "Default") || (type === "Icon" && variant === "Primary" && state === "Disabled") || (type === "Icon" && variant === "Primary" && state === "Hover") || (type === "Icon" && variant === "Primary" && state === "Pressed") || isIconAndTertiary || isDefaultAndPrimaryAndHover || isDefaultAndPrimaryAndPressed || isDefaultAndPrimaryAndDisabled || isDefaultAndTertiary) && (
          <div className={`content-stretch flex items-center relative ${isDefaultAndTertiary ? "gap-[8px]" : isIconAndTertiary ? "" : type === "Icon" && variant === "Primary" && ["Default", "Disabled", "Hover", "Pressed"].includes(state) ? "p-[8px]" : isLoaderAndPrimaryAndDefault ? "px-[16px] py-[8px]" : "gap-[8px] px-[16px] py-[8px]"}`}>
            {(isDefaultAndPrimaryAndDefault || isLoaderAndPrimaryAndDefault || isDefaultAndPrimaryAndHover || isDefaultAndPrimaryAndPressed || isDefaultAndPrimaryAndDisabled || isDefaultAndTertiary) && (
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                {isDefaultAndIsPrimaryAndHoverOrPrimaryAndPressedOrPrimaryAnd && leftIcon && <ButtonsIcon />}
                {type === "Default" && variant === "Primary" && ["Hover", "Pressed"].includes(state) && (
                  <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right text-white whitespace-nowrap">
                    <p className="leading-[24px]">{label}</p>
                  </div>
                )}
                {type === "Default" && state === "Disabled" && ["Primary", "Tertiary"].includes(variant) && (
                  <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#d3d3d3] text-[16px] text-right whitespace-nowrap">
                    <p className="leading-[24px]">{label}</p>
                  </div>
                )}
                {type === "Default" && variant === "Tertiary" && ["Hover", "Pressed"].includes(state) && (
                  <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2b2b2b] text-[16px] text-right whitespace-nowrap">
                    <p className="leading-[24px]">{label}</p>
                  </div>
                )}
                {isDefaultAndPrimaryAndDefault && leftIcon && (
                  <Wrapper1>
                    <path d={svgPaths.p600ef00} fill="var(--fill-0, white)" id="Vector" />
                  </Wrapper1>
                )}
                {isDefaultAndPrimaryAndDefault && (
                  <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right text-white whitespace-nowrap">
                    <p className="leading-[24px]">{label}</p>
                  </div>
                )}
                {isLoaderAndPrimaryAndDefault && leftIcon && (
                  <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
                    <div className="absolute inset-0 overflow-clip" data-name="Sharp-solid / Loader">
                      <div className="absolute inset-[16.67%]" data-name="Vector">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                          <path d={svgPaths.p2f980} fill="var(--fill-0, black)" id="Vector" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                {(isLoaderAndPrimaryAndDefault || (type === "Default" && variant === "Tertiary" && state === "Focused")) && (
                  <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#36454f] text-[16px] text-right whitespace-nowrap">
                    <p className="leading-[24px]">{label}</p>
                  </div>
                )}
                {isDefaultAndTertiaryAndDefault && leftIcon && <ButtonsIcon1 />}
                {isDefaultAndTertiaryAndDefault && (
                  <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#36454f] text-[16px] text-right whitespace-nowrap">
                    <p className="leading-[24px]">{label}</p>
                  </div>
                )}
              </div>
            )}
            {type === "Icon" && ((variant === "Primary" && state === "Default") || (variant === "Primary" && state === "Disabled") || (variant === "Primary" && state === "Hover") || (variant === "Primary" && state === "Pressed") || variant === "Tertiary") && <ButtonsIcon />}
            {isDefaultAndIsPrimaryAndHoverOrPrimaryAndPressedOrPrimaryAnd && rightIcon && <Helper />}
            {isDefaultAndPrimaryAndDefault && rightIcon && (
              <ButtonsIcon2>
                <path d={svgPaths.p1f4f1080} fill="var(--fill-0, white)" id="Vector" />
              </ButtonsIcon2>
            )}
            {isDefaultAndTertiaryAndDefault && rightIcon && (
              <ButtonsIcon2>
                <path d={svgPaths.p1f4f1080} fill="var(--fill-0, #36454F)" id="Vector" />
              </ButtonsIcon2>
            )}
          </div>
        )}
      </div>
      {(isIconAndPrimaryAndFocused || isIconAndSecondary || isDefaultAndPrimaryAndFocused || isDefaultAndSecondary) && (
        <div className="flex flex-row items-center size-full">
          <div className={`content-stretch flex items-center relative ${isDefaultAndIsPrimaryAndFocusedOrSecondary ? "gap-[8px] px-[16px] py-[8px]" : "p-[8px]"}`}>
            {type === "Icon" && ((variant === "Primary" && state === "Focused") || variant === "Secondary") && <ButtonsIcon />}
            {isDefaultAndIsPrimaryAndFocusedOrSecondary && (
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                {type === "Default" && ((variant === "Primary" && state === "Focused") || (variant === "Secondary" && state === "Disabled") || (variant === "Secondary" && state === "Focused") || (variant === "Secondary" && state === "Hover") || (variant === "Secondary" && state === "Pressed")) && leftIcon && <ButtonsIcon />}
                {isDefaultAndSecondaryAndIsHoverOrPressed && (
                  <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2b2b2b] text-[16px] text-right whitespace-nowrap">
                    <p className="leading-[24px]">{label}</p>
                  </div>
                )}
                {isDefaultAndPrimaryAndFocused && (
                  <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right text-white whitespace-nowrap">
                    <p className="leading-[24px]">{label}</p>
                  </div>
                )}
                {isDefaultAndSecondaryAndDefault && leftIcon && <ButtonsIcon1 />}
                {isDefaultAndSecondaryAndIsDefaultOrFocused && (
                  <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#36454f] text-[16px] text-right whitespace-nowrap">
                    <p className="leading-[24px]">{label}</p>
                  </div>
                )}
                {isDefaultAndSecondaryAndDisabled && (
                  <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#d3d3d3] text-[16px] text-right whitespace-nowrap">
                    <p className="leading-[24px]">{label}</p>
                  </div>
                )}
              </div>
            )}
            {type === "Default" && variant === "Secondary" && ["Disabled", "Focused", "Hover", "Pressed"].includes(state) && rightIcon && <Helper />}
            {isDefaultAndPrimaryAndFocused && rightIcon && <Helper />}
            {isDefaultAndSecondaryAndDefault && rightIcon && (
              <Wrapper3 additionalClassNames="size-[24px]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 9.51899">
                  <path d={svgPaths.p1f4f1080} fill="var(--fill-0, #36454F)" id="ï¸" />
                </svg>
              </Wrapper3>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Desktop() {
  return (
    <div className="bg-[#fafafa] relative size-full" data-name="Desktop - 369">
      <div className="-translate-x-1/2 absolute bg-white content-stretch flex flex-col gap-[56px] items-end left-[calc(33.33%+24px)] p-[32px] rounded-[24px] top-[136px] w-[848px]">
        <div aria-hidden="true" className="absolute border border-[#f0f0f0] border-solid inset-0 pointer-events-none rounded-[24px]" />
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
          <div className="relative shrink-0 w-full" data-name="Headings">
            <div className="content-stretch flex flex-col gap-[8px] items-start not-italic pb-[48px] relative text-[#36454f] w-full">
              <p className="font-['Poppins:Bold',sans-serif] leading-[40px] relative shrink-0 text-[32px] w-full">Financials</p>
              <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[16px] w-full">
                <p className="leading-[24px]">{`Please provide audited & latest provisional financials of your business for credit assessment.`}</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-start relative shrink-0">
            <div className="content-stretch flex flex-col items-start relative shrink-0">
              <div className="relative shrink-0 w-[784px]" data-name="Headings">
                <div className="content-stretch flex flex-col gap-[8px] items-start pb-[16px] relative w-full">
                  <p className="font-['Poppins:SemiBold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#36454f] text-[16px] w-full">Upload financials</p>
                </div>
              </div>
              <div className="content-stretch flex flex-col items-start py-[16px] relative shrink-0 w-[784px]">
                <div aria-hidden="true" className="absolute border-[#f0f0f0] border-b border-solid border-t inset-0 pointer-events-none" />
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[784px]">
                    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">
                      <Helper1 text="FY 2023-24" text1="Uploaded" />
                    </div>
                    <Buttons1 />
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col items-start py-[16px] relative shrink-0 w-[784px]">
                <div aria-hidden="true" className="absolute border-[#f0f0f0] border-b border-solid border-t inset-0 pointer-events-none" />
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[784px]">
                    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">
                      <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
                        <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#36454f] text-[16px] text-right whitespace-nowrap">
                          <p className="leading-[24px]">FY 2024-25</p>
                        </div>
                        <div className="content-stretch flex items-center justify-center relative shrink-0">
                          <StatusPillText text="Uploaded" />
                        </div>
                      </div>
                    </div>
                    <Buttons1 />
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col items-start py-[16px] relative shrink-0 w-[784px]">
                <div aria-hidden="true" className="absolute border-[#f0f0f0] border-b border-solid border-t inset-0 pointer-events-none" />
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-[784px]">
                    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">
                      <Helper1 text="FY 2025-26 (till date)" text1="Uploaded" />
                    </div>
                    <Buttons1 />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[24px] items-center justify-end relative shrink-0 w-full">
          <Buttons className="relative rounded-[2px] shrink-0" label="Go back" leftIcon={false} rightIcon={false} variant="Tertiary" />
          <Buttons className="bg-[#36454f] relative rounded-[2px] shrink-0" label="Submit" leftIcon={false} rightIcon={false} />
        </div>
      </div>
      <div className="absolute bg-[#50c878] h-[96px] left-0 top-0 w-[1440px]" data-name="Header">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-center justify-between px-[80px] py-[16px] relative size-full">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-[632px]" data-name="Clip path group">
              <div className="h-[40px] relative shrink-0 w-[171.953px]" data-name="Name=Bank X">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 171.953 40">
                  <g id="Vector">
                    <path clipRule="evenodd" d={svgPaths.p279c2680} fill="var(--fill-0, #36454F)" fillRule="evenodd" />
                    <path d={svgPaths.p1a36eb80} fill="var(--fill-0, #36454F)" />
                    <path d={svgPaths.pc06c400} fill="var(--fill-0, #36454F)" />
                    <path d={svgPaths.p1665e200} fill="var(--fill-0, #36454F)" />
                    <path d={svgPaths.p370c4780} fill="var(--fill-0, #36454F)" />
                    <path d={svgPaths.p23c44e40} fill="var(--fill-0, #36454F)" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0">
              <div className="content-stretch flex flex-col gap-[2px] items-end justify-center relative shrink-0 w-[148px]">
                <div className="content-stretch flex items-center justify-end relative shrink-0 w-full">
                  <p className="flex-[1_0_0] font-['Poppins:Bold',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#36454f] text-[16px] text-right">Radha</p>
                </div>
                <div className="content-stretch flex items-center justify-end relative shrink-0 w-full">
                  <p className="font-['Poppins:Bold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#36454f] text-[14px] whitespace-nowrap">Operations executive</p>
                </div>
              </div>
              <button className="content-stretch cursor-pointer flex items-center justify-end relative rounded-[2px] shrink-0 w-[48px]">
                <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Icon / wrapper">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                    <g id="Sharp-solid / User">
                      <path d={svgPaths.p10386580} fill="var(--fill-0, #36454F)" id="ï½" />
                    </g>
                  </svg>
                </div>
                <Wrapper3 additionalClassNames="size-[16px]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 6.34599">
                    <path d={svgPaths.p1309f900} fill="var(--fill-0, #36454F)" id="ï¸" />
                  </svg>
                </Wrapper3>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f0f0f0] bottom-0 left-px w-[1440px]" data-name="Footer">
        <div aria-hidden="true" className="absolute border-[#d3d3d3] border-solid border-t inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center justify-between px-[80px] py-[8px] relative w-full">
            <div className="content-stretch flex items-start relative shrink-0">
              <div className="content-stretch flex font-['Poppins:Medium',sans-serif] gap-[21px] items-start leading-[16px] not-italic relative shrink-0 text-[#8b8589] text-[12px] underline whitespace-nowrap">
                <p className="[text-decoration-skip-ink:none] decoration-solid relative shrink-0">{`Privacy policy `}</p>
                <p className="[text-decoration-skip-ink:none] decoration-solid relative shrink-0">Disclaimer</p>
                <p className="[text-decoration-skip-ink:none] decoration-solid relative shrink-0">{`Terms & conditions`}</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[13px] items-center relative shrink-0">
              <div className="content-stretch flex items-start relative shrink-0">
                <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0">
                  <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon">
                    <div className="absolute inset-0 overflow-clip" data-name="Sharp-light / Copyright">
                      <div className="absolute inset-[16.67%]" data-name="">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
                          <path d={svgPaths.p9e7a600} fill="var(--fill-0, #8B8589)" id="ï¹" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="font-['Poppins:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#8b8589] text-[12px] whitespace-nowrap">Biz2X by Biz2Credit 2024. All rights reserved</p>
                </div>
              </div>
              <div className="flex h-[32px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "22" } as React.CSSProperties}>
                <div className="flex-none rotate-90">
                  <div className="h-0 relative w-[32px]">
                    <div className="absolute inset-[-1px_0_0_0]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 1">
                        <line id="Line 125" stroke="var(--stroke-0, #D3D3D3)" x2="32" y1="0.5" y2="0.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0">
                <p className="font-['Poppins:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#8b8589] text-[10px] whitespace-nowrap">Powered by</p>
                <div className="h-[24px] relative shrink-0 w-[103.172px]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 103.172 24">
                    <g id="Group 865">
                      <g id="Vector">
                        <path clipRule="evenodd" d={svgPaths.p2951fa00} fill="var(--fill-0, #36454F)" fillRule="evenodd" />
                        <path d={svgPaths.p1f063900} fill="var(--fill-0, #36454F)" />
                        <path d={svgPaths.p13754100} fill="var(--fill-0, #36454F)" />
                        <path d={svgPaths.p30a5df00} fill="var(--fill-0, #36454F)" />
                        <path d={svgPaths.p241b6900} fill="var(--fill-0, #36454F)" />
                        <path d={svgPaths.p34e8cdf0} fill="var(--fill-0, #36454F)" />
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center right-[79.5px] top-[139.5px] w-[416px]">
        <div className="flex-[1_0_0] h-[569px] min-h-px min-w-px relative" data-name="Vertical stepper">
          <div className="overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex flex-col gap-[24px] items-start relative size-full">
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex items-center justify-center px-[16px] relative w-full">
                    <div className="flex flex-[1_0_0] flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#36454f] text-[14px]">
                      <p className="leading-[16px]">Application Progress</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col h-[627px] items-start overflow-clip relative shrink-0 w-full">
                <Step additionalClassNames="bg-[#d3d3d3]">
                  <Wrapper>
                    <path d={svgPaths.p31e7c780} fill="var(--fill-0, #36454F)" id="Vector" />
                  </Wrapper>
                  <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">
                    <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#36454f] text-[14px] whitespace-nowrap">
                      <p className="leading-[16px]">pan details</p>
                    </div>
                  </div>
                </Step>
                <Step>
                  <Frame41832Icon />
                  <Text text="Bank Statements" />
                </Step>
                <Step>
                  <Frame41832Icon />
                  <Text text="Shareholding Pattern" />
                </Step>
                <Step>
                  <Frame41832Icon />
                  <Wrapper2>{`Authorized Signatory `}</Wrapper2>
                </Step>
                <Step>
                  <Wrapper>
                    <path d={svgPaths.p31e7c780} fill="var(--fill-0, #D3D3D3)" id="Vector" />
                  </Wrapper>
                  <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">
                    <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#d3d3d3] text-[14px] whitespace-nowrap">
                      <p className="leading-[16px]">Business details</p>
                    </div>
                  </div>
                </Step>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}