import clsx from "clsx";
import svgPaths from "./svg-k74qpixaw5";
import imgFrame427320245 from "figma:asset/298f3f9b0f47568ea6743dca26b5f57ba232dfb8.png";
import imgFrame427320246 from "figma:asset/a1d9b7e3c2e2ac7d5a48423ceaf15797baefd768.png";

function Wrapper16({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper16Props>) {
  return (
    <div className={clsx("content-stretch flex flex-col items-start relative shrink-0 w-[310px]", additionalClassNames)}>
      <div className="content-stretch flex flex-col gap-[2px] items-end justify-center overflow-clip relative rounded-[2px] shrink-0 w-full" data-name="Input_inner">
        {children}
      </div>
    </div>
  );
}
type Wrapper15Props = {
  additionalClassNames?: string;
};

function Wrapper15({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper15Props>) {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[310px]">
      <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[310px]">
        <div className={clsx("content-stretch flex flex-col items-start relative shrink-0 w-[310px]", additionalClassNames)}>
          <div className="content-stretch flex flex-col gap-[2px] items-end justify-center overflow-clip relative rounded-[2px] shrink-0 w-full" data-name="Input_inner">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Wrapper14({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center justify-center size-full">
      <div className="content-stretch flex items-center justify-center relative">{children}</div>
    </div>
  );
}

function Wrapper13({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute inset-0 overflow-clip" data-name="Sharp-solid / Upload">
        {children}
      </div>
    </div>
  );
}
type Wrapper12Props = {
  additionalClassNames?: string;
};

function Wrapper12({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper12Props>) {
  return (
    <div className={clsx("overflow-clip relative shrink-0", additionalClassNames)}>
      <div className="absolute inset-0 overflow-clip" data-name="Style=Default">
        {children}
      </div>
    </div>
  );
}

function Wrapper11({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center size-full">
      <div className="content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative">{children}</div>
    </div>
  );
}

function Wrapper10({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute inset-[16.67%]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        {children}
      </svg>
    </div>
  );
}

function Wrapper9({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute inset-0 overflow-clip">
      <Wrapper10>{children}</Wrapper10>
    </div>
  );
}

function Wrapper8({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper11>
      <div className="content-stretch flex gap-[8px] items-center relative shrink-0">{children}</div>
    </Wrapper11>
  );
}
type Wrapper7Props = {
  acceptableFileFormat: any;
  additionalClassNames?: string;
};

function Wrapper7({ acceptableFileFormat, children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper7Props>) {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <div className="bg-white relative rounded-[2px] shrink-0 w-[310px]" data-name="Input_inner">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center overflow-clip px-[12px] py-[24px] relative rounded-[inherit] w-full">{children}</div>
        <div aria-hidden="true" className="absolute border border-[#8b8589] border-dashed inset-0 pointer-events-none rounded-[2px]" />
      </div>
      {acceptableFileFormat && <Text text="JPG, PNG or PDF, file size no more than 10MB" additionalClassNames="h-[16px] w-[310px]" />}
    </div>
  );
}

function Wrapper6({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-[#fffff0] h-[48px] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[8px] relative size-full">{children}</div>
      </div>
    </div>
  );
}
type Wrapper5Props = {
  leftIcon: any;
  rightIcon: any;
};

function Wrapper5({ leftIcon, rightIcon, children }: React.PropsWithChildren<Wrapper5Props>) {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
      {leftIcon && <InputPasswordIcon />}
      <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative">
        <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">{children}</div>
        {rightIcon && (
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
            <div className="absolute inset-0 overflow-clip" data-name="State=Hide">
              <Helper1 />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
type Wrapper4Props = {
  leftIcon: boolean;
  rightIcon: boolean;
};

function Wrapper4({ leftIcon, rightIcon, children }: React.PropsWithChildren<Wrapper4Props>) {
  return (
    <div className="content-stretch flex items-center justify-between px-[16px] py-[8px] relative w-full">
      <Wrapper5 leftIcon={leftIcon} rightIcon={rightIcon}>
        {children}
      </Wrapper5>
    </div>
  );
}

function Icon4({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper12 additionalClassNames="size-[16px]">
      <div className="absolute inset-[16.67%_22.92%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 16">
          {children}
        </svg>
      </div>
    </Wrapper12>
  );
}
type Wrapper3Props = {
  additionalClassNames?: string;
};

function Wrapper3({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper3Props>) {
  return (
    <Wrapper6>
      <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center min-h-px min-w-px relative">{children}</div>
      <Icon additionalClassNames="bg-[#fffffe] rounded-[8px] size-[24px]" />
    </Wrapper6>
  );
}
type Text7Props = {
  text: string;
  acceptableFileFormat: boolean;
  additionalClassNames?: string;
};

function Text7({ text, acceptableFileFormat, children, additionalClassNames = "" }: React.PropsWithChildren<Text7Props>) {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <p className="font-['Poppins:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#8b8589] text-[12px] w-[310px]">{text}</p>
      <Wrapper7 acceptableFileFormat={acceptableFileFormat}>
        <Icon3 />
        <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">{children}</div>
      </Wrapper7>
    </div>
  );
}
type Wrapper2Props = {
  additionalClassNames?: string;
};

function Wrapper2({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper2Props>) {
  return (
    <div className={additionalClassNames}>
      <p className="[text-decoration-skip-ink:none] decoration-solid leading-[16px] underline">{children}</p>
    </div>
  );
}

function Wrapper1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative">
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0">{children}</div>
    </div>
  );
}
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div className={clsx("content-stretch flex gap-[4px] items-center relative", additionalClassNames)}>
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
        <div className="content-stretch flex items-center relative shrink-0">{children}</div>
      </div>
    </div>
  );
}
type ButtonsLinksProps = {
  text: string;
  additionalClassNames?: string;
};

function ButtonsLinks({ children, text, additionalClassNames = "" }: React.PropsWithChildren<ButtonsLinksProps>) {
  return (
    <div className="relative shrink-0">
      <div className="flex flex-row items-center size-full">
        <Wrapper additionalClassNames={additionalClassNames}>
          <Wrapper2 additionalClassNames={clsx("flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#000080] whitespace-nowrap", additionalClassNames)}>{text}</Wrapper2>
        </Wrapper>
      </div>
    </div>
  );
}
type Text6Props = {
  text: string;
};

function Text6({ text }: Text6Props) {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
      <div className="flex flex-[1_0_0] flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#36454f] text-[16px]">
        <p className="leading-[24px]">{text}</p>
      </div>
    </div>
  );
}
type DocumentStatesProps = {
  additionalClassNames?: string;
};

function DocumentStates({ additionalClassNames = "" }: DocumentStatesProps) {
  return (
    <Wrapper3>
      <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Icon">
        <TypePdf />
      </div>
      <Links className="relative shrink-0" leftIcon={false} linkLabel="balance_sheet.pdf" rightIcon={false} />
    </Wrapper3>
  );
}
type Text5Props = {
  text: string;
};

function Text5({ text }: Text5Props) {
  return (
    <div className="content-stretch flex gap-[4px] h-[16px] items-start relative shrink-0 w-[310px]">
      <button className="cursor-pointer relative shrink-0" data-name="Info">
        <Helper8 />
      </button>
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[#8b8589] text-[10px]">{text}</p>
    </div>
  );
}
type Text4Props = {
  text: string;
};

function Text4({ text }: Text4Props) {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <ButtonsText text="Choose file" />
      <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#36454f] text-[16px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type Text3Props = {
  text: string;
};

function Text3({ text }: Text3Props) {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <ButtonsText text="Choose file" />
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#36454f] text-[16px]">{text}</p>
    </div>
  );
}
type Text2Props = {
  text: string;
  acceptableFileFormat: boolean;
  additionalClassNames?: string;
};

function Text2({ text, acceptableFileFormat, additionalClassNames = "" }: Text2Props) {
  return (
    <Wrapper7 acceptableFileFormat={acceptableFileFormat}>
      <Icon3 />
      <Text3 text={text} />
    </Wrapper7>
  );
}

function Icon3() {
  return (
    <Wrapper13>
      <DocumentUploadHelper />
    </Wrapper13>
  );
}
type Text1Props = {
  text: string;
};

function Text1({ text }: Text1Props) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="bg-white relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center p-[8px] relative w-full">
            <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#36454f] text-[16px]">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
type DocumentUploadTextProps = {
  text: string;
  additionalClassNames?: string;
};

function DocumentUploadText({ text, additionalClassNames = "" }: DocumentUploadTextProps) {
  return (
    <div className={clsx("content-stretch flex flex-col items-start relative shrink-0 w-full", additionalClassNames)}>
      <Text1 text={text} />
    </div>
  );
}
type TextProps = {
  text: string;
  additionalClassNames?: string;
};

function Text({ text, additionalClassNames = "" }: TextProps) {
  return (
    <div className={clsx("content-stretch flex gap-[4px] items-start relative shrink-0", additionalClassNames)}>
      <button className="cursor-pointer relative shrink-0" data-name="Info">
        <Helper8 />
      </button>
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[#8b8589] text-[12px]">{text}</p>
    </div>
  );
}

function DocumentUploadHelper() {
  return (
    <div className="absolute inset-[16.84%_16.67%]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 15.9156">
        <path d={svgPaths.p1da91600} fill="var(--fill-0, black)" id="Vector" />
      </svg>
    </div>
  );
}
type Helper10Props = {
  acceptableFileLabel: string;
  additionalClassNames?: string;
};

function Helper10({ acceptableFileLabel, additionalClassNames = "" }: Helper10Props) {
  return (
    <div className={clsx("content-stretch flex gap-[4px] items-start relative shrink-0", additionalClassNames)}>
      <button className="cursor-pointer relative shrink-0" data-name="Info">
        <Helper8 />
      </button>
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[#8b8589] text-[12px]">{acceptableFileLabel}</p>
    </div>
  );
}
type Helper9Props = {
  acceptableFileLabel: string;
  additionalClassNames?: string;
};

function Helper9({ acceptableFileLabel, additionalClassNames = "" }: Helper9Props) {
  return (
    <div className={clsx("content-stretch flex gap-[4px] items-start relative shrink-0", additionalClassNames)}>
      <button className="cursor-pointer relative shrink-0" data-name="Info">
        <Helper8 />
      </button>
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[#d3d3d3] text-[12px]">{acceptableFileLabel}</p>
    </div>
  );
}
type DocumentStatesBase1Props = {
  additionalClassNames?: string;
};

function DocumentStatesBase1({ additionalClassNames = "" }: DocumentStatesBase1Props) {
  return (
    <Wrapper3>
      <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Icon">
        <TypePdf />
      </div>
      <Links1 additionalClassNames="w-[119px]" />
    </Wrapper3>
  );
}
type DocumentUploadButtonsText1Props = {
  text: string;
};

function DocumentUploadButtonsText1({ text, children }: React.PropsWithChildren<DocumentUploadButtonsText1Props>) {
  return (
    <div className="relative rounded-[2px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#36454f] border-solid inset-[-0.5px] pointer-events-none rounded-[2.5px]" />
      <Wrapper8>
        <Icon4>{children}</Icon4>
        <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#36454f] text-[16px] text-right whitespace-nowrap">
          <p className="leading-[24px]">{text}</p>
        </div>
      </Wrapper8>
    </div>
  );
}
type DocumentUploadButtonsTextProps = {
  text: string;
};

function DocumentUploadButtonsText({ text, children }: React.PropsWithChildren<DocumentUploadButtonsTextProps>) {
  return (
    <div className="relative rounded-[2px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#d3d3d3] border-solid inset-[-0.5px] pointer-events-none rounded-[2.5px]" />
      <Wrapper8>
        <Icon4>{children}</Icon4>
        <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#d3d3d3] text-[16px] text-right whitespace-nowrap">
          <p className="leading-[24px]">{text}</p>
        </div>
      </Wrapper8>
    </div>
  );
}
type Icon2Props = {
  additionalClassNames?: string;
};

function Icon2({ additionalClassNames = "" }: Icon2Props) {
  return (
    <div className={clsx("overflow-clip relative shrink-0", additionalClassNames)}>
      <div className="absolute inset-0 overflow-clip" data-name="Style=Default, Direction=Down">
        <Helper7 />
      </div>
    </div>
  );
}

function Helper8() {
  return (
    <Wrapper14>
      <Icon1 />
    </Wrapper14>
  );
}
type ImageProps = {
  additionalClassNames?: string;
};

function Image({ additionalClassNames = "" }: ImageProps) {
  return (
    <div className="flex-[1_0_0] h-[64px] min-h-px min-w-px relative rounded-[2px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[2px]">
        <div className="absolute bg-white inset-0 rounded-[2px]" />
        <img alt="" className="absolute max-w-none object-cover rounded-[2px] size-full" src={imgFrame427320246} />
      </div>
      <div className="flex flex-row justify-end overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-end p-[3px] relative size-full">
          <Icon additionalClassNames="bg-[#fffffe] rounded-[2px] size-[16px]" />
        </div>
      </div>
    </div>
  );
}

function Helper7() {
  return (
    <div className="absolute inset-[30.17%_16.67%]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 9.51899">
        <path d={svgPaths.p1f4f1080} fill="var(--fill-0, black)" id="ï¸" />
      </svg>
    </div>
  );
}

function StyleDefaultDirectionDown() {
  return (
    <div className="absolute inset-0 overflow-clip">
      <Helper7 />
    </div>
  );
}

function Helper6() {
  return (
    <div className="absolute inset-[30.15%_16.67%]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 9.52718">
        <path d={svgPaths.p19d16180} fill="var(--fill-0, #36454F)" id="Primary" />
      </svg>
    </div>
  );
}
type Helper5Props = {
  additionalClassNames?: string;
};

function Helper5({ additionalClassNames = "" }: Helper5Props) {
  return (
    <div className="flex flex-row items-center size-full">
      <Wrapper additionalClassNames="w-full">
        <Wrapper2 additionalClassNames={clsx("flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#000080] whitespace-nowrap", "text-[12px]")}>{"balance_sheet.pdf"}</Wrapper2>
      </Wrapper>
    </div>
  );
}
type Links1Props = {
  additionalClassNames?: string;
};

function Links1({ additionalClassNames = "" }: Links1Props) {
  return (
    <div className={clsx("relative shrink-0", additionalClassNames)}>
      <Helper5 />
    </div>
  );
}

function DocumentStatesBaseStyleCircle() {
  return (
    <Wrapper9>
      <path d={svgPaths.p271fc6c0} fill="var(--fill-0, black)" id="Vector" />
    </Wrapper9>
  );
}

function DocumentStatesBaseSharpSolidLoader() {
  return (
    <Wrapper9>
      <path d={svgPaths.p2f980} fill="var(--fill-0, black)" id="Vector" />
    </Wrapper9>
  );
}
type ButtonsTextProps = {
  text: string;
};

function ButtonsText({ text }: ButtonsTextProps) {
  return (
    <div className="bg-[#36454f] relative rounded-[2px] shrink-0">
      <div className="flex flex-row items-center size-full">
        <Wrapper1>
          <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right text-white whitespace-nowrap">
            <p className="leading-[24px]">{text}</p>
          </div>
        </Wrapper1>
      </div>
    </div>
  );
}

function DocumentStatesBaseTypeLandscapeGroupNo() {
  return (
    <div className="absolute inset-0 overflow-clip">
      <div className="absolute inset-[16.67%_11.9%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.2857 16">
          <path d={svgPaths.p7dfc200} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Helper4() {
  return (
    <div className="absolute inset-[16.67%_17.71%]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.5 16">
        <path d={svgPaths.pbacd000} fill="var(--fill-0, black)" id="Vector" />
      </svg>
    </div>
  );
}

function TypePdf() {
  return (
    <div className="absolute inset-0 overflow-clip">
      <Helper4 />
    </div>
  );
}

function Icon1() {
  return (
    <Wrapper12 additionalClassNames="size-[16px]">
      <Wrapper10>
        <path d={svgPaths.p3c78d00} fill="var(--fill-0, black)" id="Vector" />
      </Wrapper10>
    </Wrapper12>
  );
}
type InputPasswordHelperProps = {
  errorText: string;
};

function InputPasswordHelper({ errorText }: InputPasswordHelperProps) {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-start min-h-px min-w-px relative">
      <Icon1 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-[red] whitespace-nowrap">{errorText}</p>
    </div>
  );
}
type Helper3Props = {
  leftIcon: boolean;
  activePlaceholder: boolean;
  placeholder: string;
  rightIcon: boolean;
};

function Helper3({ leftIcon, activePlaceholder, placeholder, rightIcon }: Helper3Props) {
  return (
    <div className="content-stretch flex items-center justify-between px-[16px] py-[8px] relative w-full">
      <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
        {leftIcon && <InputPasswordIcon />}
        <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">{activePlaceholder && <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[24px] min-h-px min-w-px not-italic overflow-hidden relative text-[#8b8589] text-[16px] text-ellipsis whitespace-nowrap">{placeholder}</p>}</div>
      </div>
      {rightIcon && <InputPasswordIcon1 />}
    </div>
  );
}
type Helper2Props = {
  leftIcon: boolean;
  input: string;
  rightIcon: boolean;
};

function Helper2({ leftIcon, input, rightIcon }: Helper2Props) {
  return (
    <Wrapper5 leftIcon={leftIcon} rightIcon={rightIcon}>
      <div className="flex flex-[1_0_0] flex-col font-['Font_Awesome_7_Pro:Solid',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#36454f] text-[8px] text-ellipsis tracking-[8px] whitespace-nowrap">
        <p className="leading-[24px] overflow-hidden">{input}</p>
      </div>
    </Wrapper5>
  );
}

function Helper1() {
  return (
    <div className="absolute inset-[16.67%_8.33%]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 15.9962">
        <path d={svgPaths.p1e713300} fill="var(--fill-0, black)" id="Vector" />
      </svg>
    </div>
  );
}

function InputPasswordIcon1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute inset-0 overflow-clip" data-name="State=Hide">
        <Helper1 />
      </div>
    </div>
  );
}

function InputPasswordIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <Wrapper9>
        <path d={svgPaths.p1de4080} fill="var(--fill-0, black)" id="Vector" />
      </Wrapper9>
    </div>
  );
}

function Helper() {
  return (
    <Wrapper10>
      <path d={svgPaths.p1b96cb00} fill="var(--fill-0, black)" id="ï" />
    </Wrapper10>
  );
}

function StyleDefault() {
  return (
    <div className="absolute inset-0 overflow-clip">
      <Helper />
    </div>
  );
}
type IconProps = {
  additionalClassNames?: string;
};

function Icon({ additionalClassNames = "" }: IconProps) {
  return (
    <div className={clsx("overflow-clip relative shrink-0", additionalClassNames)}>
      <StyleDefault />
    </div>
  );
}
type LinksHelper1Props = {
  linkLabel: string;
  additionalClassNames?: string;
};

function LinksHelper1({ linkLabel, additionalClassNames = "" }: LinksHelper1Props) {
  return (
    <div className={clsx("flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] whitespace-nowrap", additionalClassNames)}>
      <p className="[text-decoration-skip-ink:none] decoration-solid leading-[24px] underline">{linkLabel}</p>
    </div>
  );
}
type LinksHelperProps = {
  linkLabel: string;
  additionalClassNames?: string;
};

function LinksHelper({ linkLabel, additionalClassNames = "" }: LinksHelperProps) {
  return <Wrapper2 additionalClassNames={clsx("flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 whitespace-nowrap", additionalClassNames)}>{linkLabel}</Wrapper2>;
}
type LinksIconProps = {
  additionalClassNames?: string;
};

function LinksIcon({ additionalClassNames = "" }: LinksIconProps) {
  return (
    <div className={clsx("overflow-clip relative shrink-0", additionalClassNames)}>
      <div className="absolute inset-0 overflow-clip" data-name="Style=Default, Direction=Right">
        <div className="absolute inset-[16.67%_28.42%_16.67%_31.91%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.51899 16">
            <path d={svgPaths.p3faeba00} fill="var(--fill-0, black)" id="ï" />
          </svg>
        </div>
      </div>
    </div>
  );
}
type LinksProps = {
  className?: string;
  leftIcon?: boolean;
  linkLabel?: string;
  rightIcon?: boolean;
  size?: "Medium" | "Small" | "Large";
  state?: "Active" | "Disabled";
};

function Links({ className, leftIcon = true, linkLabel = "Preview", rightIcon = true, size = "Small", state = "Active" }: LinksProps) {
  const isLarge = size === "Large";
  const isSmallOrMedium = ["Small", "Medium"].includes(size);
  return (
    <div className={className || "relative"}>
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[4px] items-center relative">
          <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
            {isSmallOrMedium && leftIcon && <LinksIcon additionalClassNames="size-[16px]" />}
            {isSmallOrMedium && (
              <div className="content-stretch flex items-center relative shrink-0">
                {state === "Active" && size === "Small" && <LinksHelper additionalClassNames="text-[#000080] text-[12px]" linkLabel={linkLabel} />}
                {state === "Disabled" && size === "Small" && <LinksHelper additionalClassNames="text-[#d3d3d3] text-[12px]" linkLabel={linkLabel} />}
                {state === "Active" && size === "Medium" && <LinksHelper additionalClassNames="text-[#000080] text-[14px]" linkLabel={linkLabel} />}
                {state === "Disabled" && size === "Medium" && <LinksHelper additionalClassNames="text-[#d3d3d3] text-[14px]" linkLabel={linkLabel} />}
              </div>
            )}
            {isLarge && leftIcon && <LinksIcon additionalClassNames="size-[24px]" />}
            {isLarge && (
              <div className="content-stretch flex items-center relative shrink-0">
                {state === "Active" && size === "Large" && <LinksHelper1 additionalClassNames="text-[#000080]" linkLabel={linkLabel} />}
                {state === "Disabled" && size === "Large" && <LinksHelper1 additionalClassNames="text-[#d3d3d3]" linkLabel={linkLabel} />}
              </div>
            )}
          </div>
          {rightIcon && <Icon additionalClassNames="size-[16px]" />}
        </div>
      </div>
    </div>
  );
}
type InputPasswordProps = {
  className?: string;
  activeLabel?: boolean;
  activePlaceholder?: boolean;
  errorText?: string;
  input?: string;
  label?: string;
  leftIcon?: boolean;
  placeholder?: string;
  rightIcon?: boolean;
  state?: "Filled" | "Disabled" | "Default" | "Hover" | "Focused" | "Error" | "Read-only";
  variant?: "Floating" | "Outline";
};

function InputPassword({ className, activeLabel = true, activePlaceholder = true, errorText = "You’ve entered incorrect password. ", input = "", label = "Password", leftIcon = true, placeholder = "Enter", rightIcon = true, state = "Default", variant = "Floating" }: InputPasswordProps) {
  const isDefaultAndOutline = state === "Default" && variant === "Outline";
  const isDisabledAndFloating = state === "Disabled" && variant === "Floating";
  const isDisabledAndOutline = state === "Disabled" && variant === "Outline";
  const isErrorAndFloating = state === "Error" && variant === "Floating";
  const isErrorAndOutline = state === "Error" && variant === "Outline";
  const isFilledAndFloating = state === "Filled" && variant === "Floating";
  const isFilledAndOutline = state === "Filled" && variant === "Outline";
  const isFloatingAndIsDefaultOrHover = variant === "Floating" && ["Default", "Hover"].includes(state);
  const isFloatingAndIsDefaultOrHoverOrDisabled = variant === "Floating" && ["Default", "Hover", "Disabled"].includes(state);
  const isFloatingAndIsFilledOrFocusedOrErrorOrReadOnly = variant === "Floating" && ["Filled", "Focused", "Error", "Read-only"].includes(state);
  const isFocusedAndFloating = state === "Focused" && variant === "Floating";
  const isFocusedAndOutline = state === "Focused" && variant === "Outline";
  const isHoverAndOutline = state === "Hover" && variant === "Outline";
  const isOutline = variant === "Outline";
  const isOutlineAndIsFilledOrReadOnly = variant === "Outline" && ["Filled", "Read-only"].includes(state);
  const isOutlineAndIsHoverOrFilledOrReadOnly = variant === "Outline" && ["Hover", "Filled", "Read-only"].includes(state);
  const isReadOnlyAndFloating = state === "Read-only" && variant === "Floating";
  const isReadOnlyAndOutline = state === "Read-only" && variant === "Outline";
  return (
    <div className={className || `relative w-[275px] ${isOutline ? "h-[78px]" : "h-[66px]"}`}>
      <div className={`content-stretch flex flex-col items-start relative size-full ${isErrorAndFloating ? "gap-[2px] pt-[8px]" : isOutline ? "gap-[4px]" : "pt-[8px]"}`}>
        {variant === "Floating" && (
          <div className={`relative rounded-[2px] shrink-0 w-full ${variant === "Floating" && ["Read-only", "Disabled"].includes(state) ? "bg-[#f0f0f0]" : isFocusedAndFloating ? "bg-[#fffff0]" : ""}`} data-name="Input_inner">
            <div aria-hidden={isFloatingAndIsFilledOrFocusedOrErrorOrReadOnly ? "true" : undefined} className={isReadOnlyAndFloating ? "absolute border border-[#d3d3d3] border-solid inset-0 pointer-events-none rounded-[2px]" : isErrorAndFloating ? "absolute border border-[red] border-solid inset-0 pointer-events-none rounded-[2px]" : isFocusedAndFloating ? "absolute border border-[#000080] border-solid inset-0 pointer-events-none rounded-[2px]" : isFilledAndFloating ? "absolute border border-[#8b8589] border-solid inset-0 pointer-events-none rounded-[2px]" : "flex flex-row items-center overflow-clip rounded-[inherit] size-full"}>
              {isFloatingAndIsDefaultOrHoverOrDisabled && (
                <div className="content-stretch flex items-center justify-between px-[16px] py-[8px] relative w-full">
                  <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
                    {leftIcon && <InputPasswordIcon />}
                    {isFloatingAndIsDefaultOrHover && <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">{activeLabel && <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[24px] min-h-px min-w-px not-italic overflow-hidden relative text-[#8b8589] text-[16px] text-ellipsis whitespace-nowrap">{label}</p>}</div>}
                    {isDisabledAndFloating && activeLabel && <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[24px] min-h-px min-w-px not-italic overflow-hidden relative text-[#d3d3d3] text-[16px] text-ellipsis whitespace-nowrap">{label}</p>}
                  </div>
                  {isFloatingAndIsDefaultOrHover && rightIcon && <InputPasswordIcon1 />}
                  {isDisabledAndFloating && rightIcon && (
                    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
                      <div className="absolute inset-0 overflow-clip" data-name="State=Show">
                        <div className="absolute inset-[17.59%_8.33%]" data-name="">
                          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 15.5556">
                            <path d={svgPaths.p280a6200} fill="var(--fill-0, black)" id="ï®" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div aria-hidden={isFloatingAndIsDefaultOrHoverOrDisabled ? "true" : undefined} className={isDisabledAndFloating ? "absolute border border-[#d3d3d3] border-solid inset-0 pointer-events-none rounded-[2px]" : isFloatingAndIsFilledOrFocusedOrErrorOrReadOnly ? "flex flex-row items-center size-full" : state === "Hover" && variant === "Floating" ? "absolute border border-[#000080] border-solid inset-0 pointer-events-none rounded-[2px]" : "absolute border border-[#8b8589] border-solid inset-0 pointer-events-none rounded-[2px]"}>
              {isFloatingAndIsFilledOrFocusedOrErrorOrReadOnly && (
                <div className="content-stretch flex items-center justify-between px-[16px] py-[8px] relative w-full">
                  {isFilledAndFloating && activeLabel && (
                    <div className="absolute bg-[#fffffe] content-stretch flex items-center left-[12px] px-[4px] top-[-8px]">
                      <p className="font-['Poppins:Regular',sans-serif] leading-[12px] not-italic relative shrink-0 text-[#8b8589] text-[12px] whitespace-nowrap">{label}</p>
                    </div>
                  )}
                  {isFilledAndFloating && <Helper2 leftIcon={leftIcon} input={input} rightIcon={rightIcon} />}
                  {isFocusedAndFloating && activeLabel && (
                    <div className="absolute bg-[#fffffe] content-stretch flex items-center left-[12px] px-[4px] top-[-8px]">
                      <p className="font-['Poppins:Regular',sans-serif] leading-[12px] not-italic relative shrink-0 text-[#000080] text-[12px] whitespace-nowrap">{label}</p>
                    </div>
                  )}
                  {isFocusedAndFloating && <Helper2 leftIcon={leftIcon} input={input} rightIcon={rightIcon} />}
                  {isErrorAndFloating && activeLabel && (
                    <div className="absolute bg-[#fffffe] content-stretch flex items-center left-[12px] px-[4px] top-[-8px]">
                      <p className="font-['Poppins:Regular',sans-serif] leading-[12px] not-italic relative shrink-0 text-[12px] text-[red] whitespace-nowrap">{label}</p>
                    </div>
                  )}
                  {isErrorAndFloating && <Helper2 leftIcon={leftIcon} input={input} rightIcon={rightIcon} />}
                  {isReadOnlyAndFloating && activeLabel && (
                    <div className="absolute bg-[#fffffe] content-stretch flex items-center left-[12px] px-[4px] top-[-8px]">
                      <p className="font-['Poppins:Regular',sans-serif] leading-[12px] not-italic relative shrink-0 text-[#d3d3d3] text-[12px] whitespace-nowrap">{label}</p>
                    </div>
                  )}
                  {isReadOnlyAndFloating && (
                    <Wrapper5 leftIcon={leftIcon} rightIcon={rightIcon}>
                      <div className="flex flex-[1_0_0] flex-col font-['Font_Awesome_7_Pro:Solid',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#8b8589] text-[8px] text-ellipsis tracking-[8px] whitespace-nowrap">
                        <p className="leading-[24px] overflow-hidden">{input}</p>
                      </div>
                    </Wrapper5>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {isOutlineAndIsHoverOrFilledOrReadOnly && activeLabel && <p className="font-['Poppins:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#8b8589] text-[14px] whitespace-nowrap">{label}</p>}
        {isOutlineAndIsHoverOrFilledOrReadOnly && (
          <div className={`relative rounded-[2px] shrink-0 w-full ${isReadOnlyAndOutline ? "bg-[#f0f0f0]" : ""}`} data-name="Input_inner">
            <div aria-hidden={isOutlineAndIsFilledOrReadOnly ? "true" : undefined} className={isReadOnlyAndOutline ? "absolute border border-[#d3d3d3] border-solid inset-0 pointer-events-none rounded-[2px]" : isFilledAndOutline ? "absolute border border-[#8b8589] border-solid inset-0 pointer-events-none rounded-[2px]" : "flex flex-row items-center overflow-clip rounded-[inherit] size-full"}>
              {isHoverAndOutline && <Helper3 leftIcon={leftIcon} activePlaceholder={activePlaceholder} placeholder={placeholder} rightIcon={rightIcon} />}
            </div>
            <div aria-hidden={isHoverAndOutline ? "true" : undefined} className={isOutlineAndIsFilledOrReadOnly ? "flex flex-row items-center size-full" : "absolute border border-[#000080] border-solid inset-0 pointer-events-none rounded-[2px]"}>
              {isOutlineAndIsFilledOrReadOnly && (
                <Wrapper4 leftIcon={leftIcon} rightIcon={rightIcon}>
                  {isFilledAndOutline && (
                    <div className="flex flex-[1_0_0] flex-col font-['Font_Awesome_7_Pro:Solid',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#36454f] text-[8px] text-ellipsis tracking-[8px] whitespace-nowrap">
                      <p className="leading-[24px] overflow-hidden">{input}</p>
                    </div>
                  )}
                  {isReadOnlyAndOutline && (
                    <div className="flex flex-[1_0_0] flex-col font-['Font_Awesome_7_Pro:Solid',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#8b8589] text-[8px] text-ellipsis tracking-[8px] whitespace-nowrap">
                      <p className="leading-[24px] overflow-hidden">{input}</p>
                    </div>
                  )}
                </Wrapper4>
              )}
            </div>
          </div>
        )}
        {variant === "Outline" && ["Focused", "Error"].includes(state) && activeLabel && <p className="font-['Poppins:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#000080] text-[14px] whitespace-nowrap">{label}</p>}
        {state === "Error" && (
          <div className={`content-stretch flex items-start relative shrink-0 w-full ${isErrorAndOutline ? "flex-col gap-[2px]" : ""}`}>
            {isErrorAndFloating && <InputPasswordHelper errorText={errorText} />}
            {isErrorAndOutline && (
              <>
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Input_inner">
                  <div aria-hidden="true" className="absolute border border-[red] border-solid inset-0 pointer-events-none rounded-[2px]" />
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex items-center justify-between px-[16px] py-[8px] relative w-full">
                      <Helper2 leftIcon={leftIcon} input={input} rightIcon={rightIcon} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex items-start relative shrink-0 w-full">
                  <InputPasswordHelper errorText={errorText} />
                </div>
              </>
            )}
          </div>
        )}
        {isDefaultAndOutline && activeLabel && <p className="font-['Poppins:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#8b8589] text-[14px] w-[109px]">{label}</p>}
        {variant === "Outline" && ["Default", "Focused"].includes(state) && (
          <div className={`relative rounded-[2px] shrink-0 w-full ${isFocusedAndOutline ? "bg-[#fffff0]" : ""}`} data-name="Input_inner">
            <div aria-hidden={isFocusedAndOutline ? "true" : undefined} className={isFocusedAndOutline ? "absolute border border-[#8b8589] border-solid inset-0 pointer-events-none rounded-[2px]" : "flex flex-row items-center overflow-clip rounded-[inherit] size-full"}>
              {isDefaultAndOutline && <Helper3 leftIcon={leftIcon} activePlaceholder={activePlaceholder} placeholder={placeholder} rightIcon={rightIcon} />}
            </div>
            <div aria-hidden={isDefaultAndOutline ? "true" : undefined} className={isFocusedAndOutline ? "flex flex-row items-center size-full" : "absolute border border-[#8b8589] border-solid inset-0 pointer-events-none rounded-[2px]"}>
              {isFocusedAndOutline && (
                <div className="content-stretch flex items-center justify-between px-[16px] py-[8px] relative w-full">
                  <Helper2 leftIcon={leftIcon} input={input} rightIcon={rightIcon} />
                </div>
              )}
            </div>
          </div>
        )}
        {isDisabledAndOutline && activeLabel && <p className="font-['Poppins:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#d3d3d3] text-[14px] whitespace-nowrap">{label}</p>}
        {isDisabledAndOutline && (
          <div className="bg-[#f0f0f0] relative rounded-[2px] shrink-0 w-full" data-name="Input_inner">
            <div aria-hidden="true" className="absolute border border-[#d3d3d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
            <div className="flex flex-row items-center size-full">
              <Wrapper4 leftIcon={leftIcon} rightIcon={rightIcon}>
                <div className="flex flex-[1_0_0] flex-col font-['Font_Awesome_7_Pro:Solid',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#d3d3d3] text-[8px] text-ellipsis tracking-[8px] whitespace-nowrap">
                  <p className="leading-[24px] overflow-hidden">{input}</p>
                </div>
              </Wrapper4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
type DocumentStatesBaseProps = {
  className?: string;
  acceptableFileFormat?: boolean;
  acceptableFileLabel?: string;
  attachmentType?: "Single" | "Multiple";
  close?: boolean;
  documentType?: "PDF" | "IMG";
  errorText?: string;
  fileName?: string;
  size?: "Default" | "Small";
  states?: "Default" | "Document with password" | "Loading" | "Success" | "Error" | "Closed";
};

function DocumentStatesBase({ className, acceptableFileFormat = true, acceptableFileLabel = "JPG, PNG or PDF, file size no more than 10MB", attachmentType = "Single", close = true, documentType = "PDF", errorText = "Error! Upload failed.", fileName = "balance_sheet.pdf", size = "Default", states = "Loading" }: DocumentStatesBaseProps) {
  const isClosedAndDefaultAndImgAndMultiple = states === "Closed" && size === "Default" && documentType === "IMG" && attachmentType === "Multiple";
  const isDefaultAndDefaultAndImg = states === "Default" && size === "Default" && documentType === "IMG";
  const isDefaultAndDefaultAndImgAndMultiple = states === "Default" && size === "Default" && documentType === "IMG" && attachmentType === "Multiple";
  const isDefaultAndDefaultAndImgAndSingle = states === "Default" && size === "Default" && documentType === "IMG" && attachmentType === "Single";
  const isDefaultAndImgAndMultipleAndIsDefaultOrClosed = size === "Default" && documentType === "IMG" && attachmentType === "Multiple" && ["Default", "Closed"].includes(states);
  const isDefaultAndImgAndSingleAndIsLoadingOrSuccess = size === "Default" && documentType === "IMG" && attachmentType === "Single" && ["Loading", "Success"].includes(states);
  const isDefaultAndPdfAndSingle = states === "Default" && documentType === "PDF" && attachmentType === "Single";
  const isDocumentWithPasswordAndPdfAndSingle = states === "Document with password" && documentType === "PDF" && attachmentType === "Single";
  const isDocumentWithPasswordAndSmallAndPdfAndSingle = states === "Document with password" && size === "Small" && documentType === "PDF" && attachmentType === "Single";
  const isErrorAndDefaultAndPdfAndSingle = states === "Error" && size === "Default" && documentType === "PDF" && attachmentType === "Single";
  const isErrorAndPdfAndSingle = states === "Error" && documentType === "PDF" && attachmentType === "Single";
  const isErrorAndSmallAndPdfAndSingle = states === "Error" && size === "Small" && documentType === "PDF" && attachmentType === "Single";
  const isLoadingAndDefaultAndImgAndSingle = states === "Loading" && size === "Default" && documentType === "IMG" && attachmentType === "Single";
  const isLoadingAndPdfAndSingle = states === "Loading" && documentType === "PDF" && attachmentType === "Single";
  const isLoadingAndSmallAndPdfAndSingle = states === "Loading" && size === "Small" && documentType === "PDF" && attachmentType === "Single";
  const isSuccessAndDefaultAndImgAndSingle = states === "Success" && size === "Default" && documentType === "IMG" && attachmentType === "Single";
  const isSuccessAndPdfAndSingle = states === "Success" && documentType === "PDF" && attachmentType === "Single";
  return (
    <div className={className || `relative w-[342px] ${size === "Default" && documentType === "IMG" && (states === "Default" || (states === "Loading" && attachmentType === "Single") || (states === "Success" && attachmentType === "Single") || (states === "Closed" && attachmentType === "Multiple")) ? "bg-[#fffff0]" : isErrorAndSmallAndPdfAndSingle ? "bg-[#fcc] rounded-[8px]" : size === "Small" && documentType === "PDF" && attachmentType === "Single" && ["Loading", "Success", "Default"].includes(states) ? "bg-[#fffff0] rounded-[8px]" : isDocumentWithPasswordAndPdfAndSingle ? "rounded-[8px]" : isErrorAndDefaultAndPdfAndSingle ? "bg-[#fcc] h-[48px] rounded-[8px]" : "bg-[#fffff0] h-[48px] rounded-[8px]"}`}>
      <div className={`flex ${isClosedAndDefaultAndImgAndMultiple ? "content-stretch flex-col items-start p-[8px] relative w-full" : isLoadingAndSmallAndPdfAndSingle || isDefaultAndDefaultAndImg || isLoadingAndDefaultAndImgAndSingle || isSuccessAndDefaultAndImgAndSingle ? "content-stretch flex-col gap-[4px] items-start p-[8px] relative w-full" : isDocumentWithPasswordAndPdfAndSingle ? "content-stretch flex-col gap-[4px] items-start relative w-full" : documentType === "PDF" && attachmentType === "Single" && ["Success", "Default", "Error"].includes(states) ? "flex-row items-center size-full" : "content-stretch flex-col items-start justify-between p-[8px] relative size-full"}`}>
        <div className={`relative ${isDefaultAndImgAndMultipleAndIsDefaultOrClosed ? "content-stretch flex gap-[8px] h-[32px] items-center shrink-0 w-full" : isDefaultAndImgAndSingleAndIsLoadingOrSuccess ? "content-stretch flex flex-col items-start shrink-0 w-full" : isDefaultAndDefaultAndImgAndSingle ? "content-stretch flex gap-[4px] h-[32px] items-center shrink-0 w-full" : size === "Small" && documentType === "PDF" && attachmentType === "Single" && ["Success", "Default", "Error"].includes(states) ? "content-stretch flex items-center justify-between p-[8px] w-full" : isDocumentWithPasswordAndPdfAndSingle ? "bg-[#fffff0] rounded-[8px] shrink-0 w-full" : size === "Default" && documentType === "PDF" && attachmentType === "Single" && ["Success", "Default", "Error"].includes(states) ? "content-stretch flex items-center justify-between p-[8px] size-full" : "content-stretch flex gap-[4px] items-center shrink-0 w-full"}`}>
          {(isLoadingAndPdfAndSingle || isSuccessAndPdfAndSingle || isDefaultAndPdfAndSingle || isErrorAndPdfAndSingle || isDocumentWithPasswordAndPdfAndSingle || isLoadingAndDefaultAndImgAndSingle || isSuccessAndDefaultAndImgAndSingle || isDefaultAndDefaultAndImgAndMultiple || isClosedAndDefaultAndImgAndMultiple) && (
            <div className={`content-stretch flex relative ${isDefaultAndImgAndSingleAndIsLoadingOrSuccess ? "gap-[4px] h-[32px] items-center shrink-0 w-full" : isDocumentWithPasswordAndPdfAndSingle ? "flex-col gap-[8px] items-start p-[8px] w-full" : "flex-[1_0_0] gap-[4px] items-center min-h-px min-w-px"}`}>
              {(isLoadingAndPdfAndSingle || isSuccessAndPdfAndSingle || isDefaultAndPdfAndSingle || isErrorAndPdfAndSingle || isLoadingAndDefaultAndImgAndSingle || isSuccessAndDefaultAndImgAndSingle || isDefaultAndDefaultAndImgAndMultiple || isClosedAndDefaultAndImgAndMultiple) && (
                <div className={`overflow-clip relative shrink-0 ${size === "Small" && documentType === "PDF" && attachmentType === "Single" && ["Loading", "Success", "Default", "Error"].includes(states) ? "size-[16px]" : "size-[32px]"}`} data-name="Icon">
                  {documentType === "PDF" && attachmentType === "Single" && ["Loading", "Success", "Default"].includes(states) && <TypePdf />}
                  {isErrorAndPdfAndSingle && (
                    <Wrapper9>
                      <path d={svgPaths.p137f1980} fill="var(--fill-0, black)" id="Vector" />
                    </Wrapper9>
                  )}
                  {isDefaultAndImgAndSingleAndIsLoadingOrSuccess && <DocumentStatesBaseTypeLandscapeGroupNo />}
                  {isDefaultAndImgAndMultipleAndIsDefaultOrClosed && (
                    <div className="absolute inset-0 overflow-clip" data-name="Type=Landscape, Group=Yes">
                      <div className="absolute inset-[16.67%_7.14%]" data-name="Vector">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.5714 16">
                          <path d={svgPaths.p2bff9100} fill="var(--fill-0, black)" id="Vector" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {attachmentType === "Single" && ((states === "Success" && documentType === "PDF") || (states === "Default" && documentType === "PDF") || (states === "Loading" && size === "Default" && documentType === "IMG") || (states === "Success" && size === "Default" && documentType === "IMG")) && <Links className={`relative ${isDefaultAndImgAndSingleAndIsLoadingOrSuccess ? "flex-[1_0_0] min-h-px min-w-px" : states === "Success" && size === "Small" && documentType === "PDF" && attachmentType === "Single" ? "shrink-0 w-[122px]" : states === "Default" && size === "Default" && documentType === "PDF" && attachmentType === "Single" ? "shrink-0 w-[119px]" : "shrink-0 w-[118px]"}`} leftIcon={false} linkLabel={isDefaultAndImgAndSingleAndIsLoadingOrSuccess ? "IMG_23i23o.jpg" : "balance_sheet.pdf"} rightIcon={false} />}
              {documentType === "PDF" && attachmentType === "Single" && ["Error", "Document with password"].includes(states) && (
                <div className={`content-stretch flex items-center relative shrink-0 ${isDocumentWithPasswordAndPdfAndSingle ? "justify-between w-full" : "gap-[8px]"}`}>
                  {isDocumentWithPasswordAndPdfAndSingle && (
                    <div className={`content-stretch flex gap-[4px] items-center relative ${isDocumentWithPasswordAndSmallAndPdfAndSingle ? "shrink-0 w-[138px]" : "flex-[1_0_0] min-h-px min-w-px"}`}>
                      <div className={`overflow-clip relative shrink-0 ${isDocumentWithPasswordAndSmallAndPdfAndSingle ? "size-[16px]" : "size-[32px]"}`} data-name="Icon">
                        <TypePdf />
                      </div>
                      <Links className={`relative shrink-0 ${isDocumentWithPasswordAndSmallAndPdfAndSingle ? "w-[290px]" : ""}`} leftIcon={false} linkLabel="balance_sheet.pdf" rightIcon={false} />
                    </div>
                  )}
                  {isErrorAndDefaultAndPdfAndSingle && (
                    <>
                      <p className="font-['Poppins:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#36454f] text-[14px] whitespace-nowrap">{errorText}</p>
                      <ButtonsLinks text="Retry" additionalClassNames="text-[14px]" />
                    </>
                  )}
                  {states === "Document with password" && size === "Default" && documentType === "PDF" && attachmentType === "Single" && close && <Icon additionalClassNames="bg-[#fffffe] rounded-[8px] size-[24px]" />}
                  {isErrorAndSmallAndPdfAndSingle && (
                    <>
                      <p className="font-['Poppins:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#36454f] text-[12px] whitespace-nowrap">{errorText}</p>
                      <ButtonsLinks text="Retry" additionalClassNames="text-[12px]" />
                    </>
                  )}
                  {isDocumentWithPasswordAndSmallAndPdfAndSingle && close && <Icon additionalClassNames="bg-[#fffffe] rounded-[8px] size-[16px]" />}
                </div>
              )}
              {isDocumentWithPasswordAndPdfAndSingle && (
                <>
                  <InputPassword className="h-[66px] relative shrink-0 w-[326px]" leftIcon={false} state="Filled" />
                  <div className="content-stretch flex flex-col items-end relative shrink-0 w-full">
                    <ButtonsText text="Add" />
                  </div>
                </>
              )}
              {isDefaultAndImgAndSingleAndIsLoadingOrSuccess && (
                <div className="overflow-clip relative rounded-[8px] shrink-0 size-[24px]" data-name="Icon">
                  {isLoadingAndDefaultAndImgAndSingle && <DocumentStatesBaseSharpSolidLoader />}
                  {isSuccessAndDefaultAndImgAndSingle && <DocumentStatesBaseStyleCircle />}
                </div>
              )}
              {isDefaultAndImgAndMultipleAndIsDefaultOrClosed && <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[24px] min-h-px min-w-px not-italic overflow-hidden relative text-[#36454f] text-[16px] text-ellipsis whitespace-nowrap">4 photos uploaded</p>}
              {states === "Loading" && size === "Default" && documentType === "PDF" && attachmentType === "Single" && <Links1 additionalClassNames="w-[118px]" />}
              {isLoadingAndSmallAndPdfAndSingle && <p className="[text-decoration-skip-ink:none] decoration-solid flex-[1_0_0] font-['Poppins:SemiBold',sans-serif] leading-[16px] min-h-px min-w-px not-italic overflow-hidden relative text-[#36454f] text-[12px] text-ellipsis underline whitespace-nowrap">{fileName}</p>}
            </div>
          )}
          {(isLoadingAndPdfAndSingle || isSuccessAndPdfAndSingle || isDefaultAndDefaultAndImg || isClosedAndDefaultAndImgAndMultiple) && (
            <div className={`overflow-clip relative shrink-0 ${isDefaultAndDefaultAndImgAndSingle ? "size-[32px]" : size === "Small" && documentType === "PDF" && attachmentType === "Single" && ["Loading", "Success"].includes(states) ? "size-[16px]" : "size-[24px]"}`} data-name="Icon">
              {isLoadingAndPdfAndSingle && <DocumentStatesBaseSharpSolidLoader />}
              {isSuccessAndPdfAndSingle && <DocumentStatesBaseStyleCircle />}
              {isDefaultAndDefaultAndImgAndSingle && <DocumentStatesBaseTypeLandscapeGroupNo />}
              {isDefaultAndDefaultAndImgAndMultiple && (
                <div className="absolute inset-0 overflow-clip" data-name="Style=Default, Direction=Up">
                  <Helper6 />
                </div>
              )}
              {isClosedAndDefaultAndImgAndMultiple && <StyleDefaultDirectionDown />}
            </div>
          )}
          {size === "Default" && documentType === "PDF" && attachmentType === "Single" && ["Default", "Error"].includes(states) && close && <Icon additionalClassNames="bg-[#fffffe] rounded-[8px] size-[24px]" />}
          {size === "Small" && documentType === "PDF" && attachmentType === "Single" && ["Default", "Error"].includes(states) && close && <Icon additionalClassNames="bg-[#fffffe] rounded-[8px] size-[16px]" />}
          {isDefaultAndDefaultAndImgAndSingle && (
            <>
              <Links className="flex-[1_0_0] min-h-px min-w-px relative" leftIcon={false} linkLabel="IMG_23i23o.jpg" rightIcon={false} />
              <Icon additionalClassNames="bg-[#fffffe] rounded-[8px] size-[24px]" />
            </>
          )}
          {isLoadingAndDefaultAndImgAndSingle && <div className="bg-[#36454f] h-px rounded-[2px] shrink-0 w-[264px]" />}
        </div>
        {(isLoadingAndPdfAndSingle || isDefaultAndDefaultAndImgAndMultiple) && (
          <div className={`shrink-0 ${isDefaultAndDefaultAndImgAndMultiple ? "content-center flex flex-wrap gap-[10px] items-center overflow-clip relative w-full" : "bg-[#36454f] h-px rounded-[2px] w-[264px]"}`}>
            {isDefaultAndDefaultAndImgAndMultiple && (
              <>
                <Image />
                <Image />
                <Image />
                <Image />
              </>
            )}
          </div>
        )}
        {size === "Default" && documentType === "IMG" && attachmentType === "Single" && ["Default", "Loading", "Success"].includes(states) && (
          <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="upload">
            <div className="content-stretch flex flex-col gap-[8px] items-start p-[8px] relative w-full">
              <div className={`h-[205px] relative rounded-[2px] shrink-0 w-full ${isLoadingAndDefaultAndImgAndSingle ? "blur-[3px]" : ""}`}>
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[2px]">
                  <div className={`absolute inset-0 rounded-[2px] ${isDefaultAndImgAndSingleAndIsLoadingOrSuccess ? "bg-[#36454f]" : "bg-white"}`} />
                  <div className="absolute inset-0 overflow-hidden rounded-[2px]">
                    <img alt="" className="absolute h-[91.13%] left-[-24.48%] max-w-none top-[4.75%] w-[149.3%]" src={imgFrame427320245} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {isDocumentWithPasswordAndPdfAndSingle && acceptableFileFormat && (
          <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
            <div className="relative shrink-0" data-name="Info">
              <Helper8 />
            </div>
            <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[#8b8589] text-[12px]">{acceptableFileLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
}
type DocumentUploadProps = {
  className?: string;
  acceptableFileFormat?: boolean;
  acceptableFileLabel?: string;
  device?: "Mobile" | "Large desktop";
  documentName?: string;
  documentName2?: boolean;
  frontBack?: boolean;
  size?: "Default" | "Small" | "Big";
  state?: "Default" | "Selected" | "Open" | "Disabled" | "Hover" | "Error" | "Uploaded inactive" | "Uploaded active";
  type?: "Default" | "Select document type" | "Select document type disabled";
};

function DocumentUpload({ className, acceptableFileFormat = true, acceptableFileLabel = "JPG, PNG or PDF, file size no more than 10MB", device = "Mobile", documentName = "Balance Sheet ", documentName2 = true, frontBack = false, size = "Default", state = "Default", type = "Default" }: DocumentUploadProps) {
  const isDefaultAndDefaultAndUploadedActiveAndNotFrontBack = size === "Default" && type === "Default" && state === "Uploaded active" && !frontBack;
  const isLargeDesktopAndBigAndDefaultAndErrorAndNotFrontBack = device === "Large desktop" && size === "Big" && type === "Default" && state === "Error" && !frontBack;
  const isLargeDesktopAndBigAndDefaultAndHoverAndNotFrontBack = device === "Large desktop" && size === "Big" && type === "Default" && state === "Hover" && !frontBack;
  const isLargeDesktopAndBigAndDefaultAndNotFrontBackAndIsUploaded = device === "Large desktop" && size === "Big" && type === "Default" && !frontBack && ["Uploaded inactive", "Hover"].includes(state);
  const isLargeDesktopAndBigAndDefaultAndUploadedInactiveAndNotFrontBack = device === "Large desktop" && size === "Big" && type === "Default" && state === "Uploaded inactive" && !frontBack;
  const isLargeDesktopAndBigAndNotFrontBackAndIsDefaultAndDefaultOr = device === "Large desktop" && size === "Big" && !frontBack && ((type === "Default" && state === "Default") || (type === "Select document type" && state === "Selected") || (type === "Default" && state === "Uploaded inactive") || (type === "Default" && state === "Hover"));
  const isLargeDesktopAndBigAndNotFrontBackAndIsDefaultAndDefaultOr1 = device === "Large desktop" && size === "Big" && !frontBack && ((type === "Default" && state === "Default") || (type === "Select document type" && state === "Selected"));
  const isLargeDesktopAndDefaultAndDefaultAndErrorAndNotFrontBack = device === "Large desktop" && size === "Default" && type === "Default" && state === "Error" && !frontBack;
  const isLargeDesktopAndDefaultAndDefaultAndUploadedActiveAndNotFront = device === "Large desktop" && size === "Default" && type === "Default" && state === "Uploaded active" && !frontBack;
  const isLargeDesktopAndDefaultAndDefaultAndUploadedInactiveAndNotFront = device === "Large desktop" && size === "Default" && type === "Default" && state === "Uploaded inactive" && !frontBack;
  const isLargeDesktopAndDefaultAndHoverAndNotFrontBackAndIsDefaultOr = device === "Large desktop" && type === "Default" && state === "Hover" && !frontBack && ["Default", "Small"].includes(size);
  const isLargeDesktopAndDefaultAndNotFrontBackAndIsDefaultAndUploaded = device === "Large desktop" && type === "Default" && !frontBack && ((size === "Default" && state === "Uploaded inactive") || (size === "Small" && state === "Uploaded inactive") || (size === "Default" && state === "Uploaded active") || (size === "Small" && state === "Uploaded active"));
  const isLargeDesktopAndDefaultAndSelectDocumentTypeAndFrontBackAndIs = device === "Large desktop" && size === "Default" && type === "Select document type" && frontBack && ["Uploaded active", "Uploaded inactive"].includes(state);
  const isLargeDesktopAndDefaultAndSelectDocumentTypeAndIsSelectedOr = device === "Large desktop" && size === "Default" && type === "Select document type" && ["Selected", "Uploaded active", "Uploaded inactive"].includes(state);
  const isLargeDesktopAndDefaultAndSelectDocumentTypeAndIsUploadedActive = device === "Large desktop" && size === "Default" && type === "Select document type" && (state === "Uploaded active" || (state === "Selected" && frontBack) || state === "Uploaded inactive");
  const isLargeDesktopAndDefaultAndSelectDocumentTypeAndNotFrontBackAnd = device === "Large desktop" && size === "Default" && type === "Select document type" && !frontBack && ["Default", "Open"].includes(state);
  const isLargeDesktopAndDefaultAndSelectDocumentTypeAndNotFrontBackAnd1 = device === "Large desktop" && size === "Default" && type === "Select document type" && !frontBack && ["Uploaded active", "Uploaded inactive"].includes(state);
  const isLargeDesktopAndDefaultAndSelectDocumentTypeAndOpenAndNotFront = device === "Large desktop" && size === "Default" && type === "Select document type" && state === "Open" && !frontBack;
  const isLargeDesktopAndDefaultAndSelectDocumentTypeAndSelectedAndFront = device === "Large desktop" && size === "Default" && type === "Select document type" && state === "Selected" && frontBack;
  const isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedActive = device === "Large desktop" && size === "Default" && type === "Select document type" && state === "Uploaded active" && !frontBack;
  const isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive = device === "Large desktop" && size === "Default" && type === "Select document type" && state === "Uploaded inactive" && frontBack;
  const isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive1 = device === "Large desktop" && size === "Default" && type === "Select document type" && state === "Uploaded inactive" && !frontBack;
  const isLargeDesktopAndDefaultAndUploadedActiveAndNotFrontBackAndIs = device === "Large desktop" && type === "Default" && state === "Uploaded active" && !frontBack && ["Default", "Small"].includes(size);
  const isLargeDesktopAndNotFrontBackAndIsDefaultAndSelectDocumentType = device === "Large desktop" && !frontBack && ((size === "Default" && type === "Select document type" && state === "Selected") || (size === "Default" && type === "Default" && state === "Error") || (size === "Default" && type === "Default" && state === "Default") || (size === "Small" && type === "Default" && state === "Default") || (size === "Default" && type === "Select document type" && state === "Open"));
  const isLargeDesktopAndSmallAndDefaultAndNotFrontBackAndIsUploaded = device === "Large desktop" && size === "Small" && type === "Default" && !frontBack && ["Uploaded inactive", "Uploaded active"].includes(state);
  const isLargeDesktopAndSmallAndDefaultAndUploadedActiveAndNotFrontBack = device === "Large desktop" && size === "Small" && type === "Default" && state === "Uploaded active" && !frontBack;
  const isLargeDesktopAndSmallAndDefaultAndUploadedInactiveAndNotFront = device === "Large desktop" && size === "Small" && type === "Default" && state === "Uploaded inactive" && !frontBack;
  const isMobileAndDefaultAndDefaultAndDefaultAndNotFrontBack = device === "Mobile" && size === "Default" && type === "Default" && state === "Default" && !frontBack;
  const isMobileAndDefaultAndDefaultAndDisabledAndNotFrontBack = device === "Mobile" && size === "Default" && type === "Default" && state === "Disabled" && !frontBack;
  const isMobileAndDefaultAndDefaultAndUploadedActiveAndNotFrontBack = device === "Mobile" && size === "Default" && type === "Default" && state === "Uploaded active" && !frontBack;
  const isMobileAndDefaultAndDisabledAndNotFrontBackAndIsDefaultOrSelect = device === "Mobile" && size === "Default" && state === "Disabled" && !frontBack && ["Default", "Select document type"].includes(type);
  const isMobileAndDefaultAndFrontBackAndIsSelectDocumentTypeDisabledAnd = device === "Mobile" && size === "Default" && frontBack && ((type === "Select document type disabled" && state === "Selected") || (type === "Select document type" && state === "Uploaded active"));
  const isMobileAndDefaultAndSelectDocumentTypeAndDisabledAndNotFront = device === "Mobile" && size === "Default" && type === "Select document type" && state === "Disabled" && !frontBack;
  const isMobileAndDefaultAndSelectDocumentTypeAndNotFrontBackAndIs = device === "Mobile" && size === "Default" && type === "Select document type" && !frontBack && ["Default", "Open", "Disabled"].includes(state);
  const isMobileAndDefaultAndSelectDocumentTypeAndNotFrontBackAndIsOpen = device === "Mobile" && size === "Default" && type === "Select document type" && !frontBack && ["Open", "Disabled"].includes(state);
  const isMobileAndDefaultAndSelectDocumentTypeAndOpenAndNotFrontBack = device === "Mobile" && size === "Default" && type === "Select document type" && state === "Open" && !frontBack;
  const isMobileAndDefaultAndSelectDocumentTypeAndSelectedAndNotFront = device === "Mobile" && size === "Default" && type === "Select document type" && state === "Selected" && !frontBack;
  const isMobileAndDefaultAndSelectDocumentTypeAndUploadedActiveAndFront = device === "Mobile" && size === "Default" && type === "Select document type" && state === "Uploaded active" && frontBack;
  const isMobileAndDefaultAndSelectDocumentTypeAndUploadedActiveAndNot = device === "Mobile" && size === "Default" && type === "Select document type" && state === "Uploaded active" && !frontBack;
  const isMobileAndDefaultAndSelectDocumentTypeAndUploadedInactiveAndNot = device === "Mobile" && size === "Default" && type === "Select document type" && state === "Uploaded inactive" && !frontBack;
  const isMobileAndDefaultAndSelectDocumentTypeDisabledAndSelectedAnd = device === "Mobile" && size === "Default" && type === "Select document type disabled" && state === "Selected" && frontBack;
  return (
    <div className={className || `relative ${isLargeDesktopAndBigAndDefaultAndErrorAndNotFrontBack ? "w-[789px]" : isLargeDesktopAndBigAndDefaultAndHoverAndNotFrontBack ? "bg-[#f0f0f0] w-[784px]" : isLargeDesktopAndBigAndDefaultAndUploadedInactiveAndNotFrontBack ? "bg-white w-[784px]" : device === "Large desktop" && size === "Big" && type === "Select document type" && state === "Selected" && !frontBack ? "bg-[#fffff0] w-[784px]" : device === "Large desktop" && size === "Big" && type === "Default" && state === "Default" && !frontBack ? "w-[784px]" : isLargeDesktopAndDefaultAndSelectDocumentTypeAndOpenAndNotFront ? "h-[160px] w-[310px]" : isLargeDesktopAndDefaultAndDefaultAndUploadedActiveAndNotFront ? "h-[276px] w-[310px]" : device === "Large desktop" && ((size === "Default" && type === "Select document type" && state === "Default" && !frontBack) || (size === "Default" && type === "Select document type" && state === "Selected") || (size === "Default" && type === "Default" && state === "Hover" && !frontBack) || (size === "Small" && type === "Default" && state === "Hover" && !frontBack) || (size === "Default" && type === "Default" && state === "Error" && !frontBack) || (size === "Default" && type === "Default" && state === "Disabled" && !frontBack) || (size === "Default" && type === "Default" && state === "Default" && !frontBack) || (size === "Small" && type === "Default" && state === "Default" && !frontBack) || (size === "Small" && type === "Default" && state === "Disabled" && !frontBack) || (size === "Default" && type === "Default" && state === "Uploaded inactive" && !frontBack) || (size === "Small" && type === "Default" && state === "Uploaded inactive" && !frontBack) || (size === "Small" && type === "Default" && state === "Uploaded active" && !frontBack) || (size === "Default" && type === "Select document type" && state === "Uploaded active") || (size === "Default" && type === "Select document type" && state === "Uploaded inactive")) ? "w-[310px]" : isMobileAndDefaultAndSelectDocumentTypeAndUploadedActiveAndNot ? "h-[236px] w-[342px]" : "rounded-[8px] w-[342px]"}`}>
      <div aria-hidden={isLargeDesktopAndBigAndNotFrontBackAndIsDefaultAndDefaultOr ? "true" : undefined} className={isLargeDesktopAndBigAndDefaultAndErrorAndNotFrontBack ? "content-stretch flex flex-col items-start relative w-full" : device === "Large desktop" && size === "Big" && !frontBack && ((type === "Select document type" && state === "Selected") || (type === "Default" && state === "Hover")) ? "absolute border border-[#36454f] border-dashed inset-0 pointer-events-none" : device === "Large desktop" && size === "Big" && type === "Default" && !frontBack && ["Default", "Uploaded inactive"].includes(state) ? "absolute border border-[#f0f0f0] border-dashed inset-0 pointer-events-none" : isLargeDesktopAndDefaultAndSelectDocumentTypeAndOpenAndNotFront ? "content-stretch flex flex-col gap-[4px] items-start relative size-full" : isLargeDesktopAndDefaultAndDefaultAndUploadedActiveAndNotFront ? "content-stretch flex flex-col gap-[16px] items-start relative size-full" : device === "Large desktop" && ((size === "Default" && type === "Select document type" && state === "Default" && !frontBack) || (size === "Default" && type === "Select document type" && state === "Selected") || (size === "Default" && type === "Default" && state === "Hover" && !frontBack) || (size === "Small" && type === "Default" && state === "Hover" && !frontBack) || (size === "Default" && type === "Default" && state === "Error" && !frontBack) || (size === "Default" && type === "Default" && state === "Disabled" && !frontBack) || (size === "Default" && type === "Default" && state === "Default" && !frontBack) || (size === "Small" && type === "Default" && state === "Default" && !frontBack) || (size === "Small" && type === "Default" && state === "Disabled" && !frontBack) || (size === "Default" && type === "Select document type" && state === "Uploaded active") || (size === "Default" && type === "Select document type" && state === "Uploaded inactive")) ? "content-stretch flex flex-col gap-[4px] items-start relative w-full" : type === "Default" && !frontBack && ((device === "Mobile" && size === "Default" && state === "Uploaded active") || (device === "Large desktop" && size === "Default" && state === "Uploaded inactive") || (device === "Large desktop" && size === "Small" && state === "Uploaded inactive") || (device === "Large desktop" && size === "Small" && state === "Uploaded active")) ? "content-stretch flex flex-col gap-[16px] items-start relative w-full" : isMobileAndDefaultAndSelectDocumentTypeAndUploadedActiveAndNot ? "absolute content-stretch flex flex-col gap-[4px] inset-[0_0_71.19%_0] items-start" : "flex flex-col justify-center size-full"}>
        {(isMobileAndDefaultAndDefaultAndDefaultAndNotFrontBack || (size === "Default" && type === "Select document type" && state === "Default" && !frontBack) || (size === "Default" && type === "Select document type" && state === "Selected" && !frontBack) || (size === "Default" && type === "Select document type" && state === "Uploaded active") || (size === "Default" && type === "Select document type" && state === "Uploaded inactive" && !frontBack) || isMobileAndDefaultAndSelectDocumentTypeDisabledAndSelectedAnd || (size === "Default" && type === "Select document type" && state === "Open" && !frontBack) || isMobileAndDefaultAndDefaultAndDisabledAndNotFrontBack || isMobileAndDefaultAndSelectDocumentTypeAndDisabledAndNotFront || isDefaultAndDefaultAndUploadedActiveAndNotFrontBack || isLargeDesktopAndDefaultAndDefaultAndUploadedInactiveAndNotFront || isLargeDesktopAndSmallAndDefaultAndUploadedInactiveAndNotFront || isLargeDesktopAndSmallAndDefaultAndUploadedActiveAndNotFrontBack || isLargeDesktopAndDefaultAndSelectDocumentTypeAndSelectedAndFront || isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive) && (
          <div className={`relative w-full ${isLargeDesktopAndDefaultAndDefaultAndUploadedActiveAndNotFront ? "content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px" : isLargeDesktopAndDefaultAndDefaultAndUploadedInactiveAndNotFront ? "content-stretch flex flex-col gap-[4px] h-[148px] items-start shrink-0" : device === "Large desktop" && size === "Default" && type === "Select document type" && ((state === "Default" && !frontBack) || state === "Selected" || (state === "Open" && !frontBack) || state === "Uploaded active" || state === "Uploaded inactive") ? "content-stretch flex items-center shrink-0" : type === "Default" && !frontBack && ((device === "Mobile" && size === "Default" && state === "Uploaded active") || (device === "Large desktop" && size === "Small" && state === "Uploaded inactive") || (device === "Large desktop" && size === "Small" && state === "Uploaded active")) ? "content-stretch flex flex-col gap-[4px] items-start shrink-0" : isMobileAndDefaultAndSelectDocumentTypeAndUploadedInactiveAndNot ? "content-stretch flex flex-col gap-[16px] items-start justify-center" : isMobileAndDefaultAndSelectDocumentTypeAndUploadedActiveAndNot ? "bg-[#f5f5dc] h-[48px] rounded-[8px] shrink-0" : "content-stretch flex flex-col gap-[4px] items-start justify-center"}`}>
            {size === "Default" && ((device === "Mobile" && type === "Default" && state === "Default" && !frontBack) || (type === "Select document type" && state === "Default" && !frontBack) || (type === "Select document type" && state === "Selected" && !frontBack) || (type === "Select document type" && state === "Uploaded active") || (type === "Select document type" && state === "Uploaded inactive" && !frontBack) || (device === "Mobile" && type === "Select document type disabled" && state === "Selected" && frontBack) || (type === "Select document type" && state === "Open" && !frontBack) || (device === "Mobile" && type === "Default" && state === "Disabled" && !frontBack) || (device === "Mobile" && type === "Select document type" && state === "Disabled" && !frontBack) || (device === "Mobile" && type === "Default" && state === "Uploaded active" && !frontBack) || (device === "Large desktop" && type === "Select document type" && state === "Selected" && frontBack) || (device === "Large desktop" && type === "Select document type" && state === "Uploaded inactive" && frontBack)) && (
              <div className={isLargeDesktopAndDefaultAndSelectDocumentTypeAndOpenAndNotFront ? "bg-[#fffff0] content-stretch flex gap-[4px] items-center relative rounded-[2px] shrink-0" : device === "Large desktop" && size === "Default" && type === "Select document type" && ((state === "Default" && !frontBack) || state === "Selected" || state === "Uploaded active" || state === "Uploaded inactive") ? "content-stretch flex gap-[4px] items-center relative rounded-[2px] shrink-0" : isMobileAndDefaultAndDefaultAndUploadedActiveAndNotFrontBack ? "bg-[#f5f5dc] h-[48px] relative rounded-[8px] shrink-0 w-full" : isMobileAndDefaultAndDisabledAndNotFrontBackAndIsDefaultOrSelect ? "bg-[#f0f0f0] relative rounded-[8px] shrink-0 w-full" : isMobileAndDefaultAndFrontBackAndIsSelectDocumentTypeDisabledAnd ? "bg-[#f5f5dc] content-stretch flex flex-col gap-[4px] items-start pb-[4px] relative rounded-[8px] shrink-0 w-full" : isMobileAndDefaultAndSelectDocumentTypeAndUploadedInactiveAndNot ? "content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" : isMobileAndDefaultAndSelectDocumentTypeAndUploadedActiveAndNot ? "flex flex-row items-center size-full" : "bg-[#f5f5dc] relative rounded-[8px] shrink-0 w-full"}>
                {device === "Mobile" && size === "Default" && ((type === "Default" && state === "Default" && !frontBack) || (type === "Select document type" && state === "Default" && !frontBack) || (type === "Select document type" && state === "Selected" && !frontBack) || (type === "Select document type" && state === "Uploaded active") || (type === "Select document type" && state === "Uploaded inactive" && !frontBack) || (type === "Select document type disabled" && state === "Selected" && frontBack) || (type === "Select document type" && state === "Open" && !frontBack) || (type === "Default" && state === "Disabled" && !frontBack) || (type === "Select document type" && state === "Disabled" && !frontBack) || (type === "Default" && state === "Uploaded active" && !frontBack)) && (
                  <div className={isMobileAndDefaultAndFrontBackAndIsSelectDocumentTypeDisabledAnd ? "bg-[#f5f5dc] content-stretch flex h-[40px] items-center p-[8px] relative rounded-[8px] shrink-0 w-[342px]" : isMobileAndDefaultAndSelectDocumentTypeAndUploadedInactiveAndNot ? "bg-[#f0f0f0] h-[48px] relative rounded-[8px] shrink-0 w-full" : isMobileAndDefaultAndSelectDocumentTypeAndUploadedActiveAndNot ? "content-stretch flex items-center justify-between p-[8px] relative size-full" : "flex flex-row items-center size-full"}>
                    <div className={`flex items-center ${isMobileAndDefaultAndDefaultAndUploadedActiveAndNotFrontBack ? "content-stretch p-[8px] relative size-full" : isMobileAndDefaultAndSelectDocumentTypeAndUploadedInactiveAndNot ? "flex-row size-full" : device === "Mobile" && size === "Default" && ((type === "Select document type" && state === "Uploaded active") || (type === "Select document type disabled" && state === "Selected" && frontBack)) ? "content-stretch gap-[4px] pr-[8px] relative rounded-[2px] shrink-0" : device === "Mobile" && size === "Default" && !frontBack && ((type === "Select document type" && state === "Default") || (type === "Select document type" && state === "Selected") || (type === "Select document type" && state === "Open") || (type === "Default" && state === "Disabled") || (type === "Select document type" && state === "Disabled")) ? "content-stretch justify-between p-[8px] relative w-full" : "content-stretch gap-[8px] p-[8px] relative w-full"}`}>
                      {device === "Mobile" && size === "Default" && !frontBack && ((type === "Select document type" && state === "Default") || (type === "Select document type" && state === "Uploaded inactive") || (type === "Select document type" && state === "Open") || (type === "Select document type" && state === "Disabled") || (type === "Default" && state === "Uploaded active")) && (
                        <div className={`content-stretch flex items-center relative ${isMobileAndDefaultAndDefaultAndUploadedActiveAndNotFrontBack ? "flex-[1_0_0] gap-[4px] min-h-px min-w-px" : isMobileAndDefaultAndSelectDocumentTypeAndOpenAndNotFrontBack ? "bg-white gap-[4px] pr-[8px] rounded-[2px] shrink-0" : isMobileAndDefaultAndSelectDocumentTypeAndUploadedInactiveAndNot ? "justify-between p-[8px] size-full" : "gap-[4px] pr-[8px] shrink-0"}`}>
                          {isMobileAndDefaultAndSelectDocumentTypeAndNotFrontBackAndIs && (
                            <>
                              <p className={`font-["Poppins:Regular",sans-serif] leading-[24px] not-italic overflow-hidden relative shrink-0 text-[16px] text-ellipsis whitespace-nowrap ${isMobileAndDefaultAndSelectDocumentTypeAndDisabledAndNotFront ? "text-[#d3d3d3]" : "text-[#36454f]"}`}>Select document type</p>
                              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon">
                                {device === "Mobile" && size === "Default" && type === "Select document type" && !frontBack && ["Default", "Disabled"].includes(state) && (
                                  <div className="absolute inset-0 overflow-clip" data-name="Style=Default, Direction=Down">
                                    <Helper7 />
                                  </div>
                                )}
                                {isMobileAndDefaultAndSelectDocumentTypeAndOpenAndNotFrontBack && (
                                  <div className="absolute inset-0 overflow-clip" data-name="Style=Default, Direction=Up">
                                    <Helper6 />
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                          {isMobileAndDefaultAndSelectDocumentTypeAndUploadedInactiveAndNot && (
                            <>
                              <div className="content-stretch flex gap-[4px] items-center pr-[8px] relative rounded-[2px] shrink-0">
                                <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic overflow-hidden relative shrink-0 text-[#d3d3d3] text-[16px] text-ellipsis whitespace-nowrap">{documentName}</p>
                                <Icon2 additionalClassNames="size-[16px]" />
                              </div>
                              <DocumentUploadButtonsText text="Add">
                                <path d={svgPaths.p600ef00} fill="var(--fill-0, black)" id="Vector" />
                              </DocumentUploadButtonsText>
                            </>
                          )}
                          {isMobileAndDefaultAndDefaultAndUploadedActiveAndNotFrontBack && (
                            <>
                              <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#36454f] text-[16px]">{documentName}</p>
                              <DocumentUploadButtonsText1 text="Add">
                                <path d={svgPaths.p600ef00} fill="var(--fill-0, black)" id="Vector" />
                              </DocumentUploadButtonsText1>
                            </>
                          )}
                        </div>
                      )}
                      {isMobileAndDefaultAndSelectDocumentTypeAndNotFrontBackAndIs && (
                        <div className="relative rounded-[2px] shrink-0" data-name="Buttons">
                          <div aria-hidden="true" className={`absolute border border-solid inset-[-0.5px] pointer-events-none rounded-[2.5px] ${isMobileAndDefaultAndSelectDocumentTypeAndNotFrontBackAndIsOpen ? "border-[#d3d3d3]" : "border-[#36454f]"}`} />
                          <Wrapper8>
                            <Icon4>
                              <path d={svgPaths.p600ef00} fill="var(--fill-0, black)" id="Vector" />
                            </Icon4>
                            <div className={`flex flex-col font-["Poppins:Bold",sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right whitespace-nowrap ${isMobileAndDefaultAndSelectDocumentTypeAndNotFrontBackAndIsOpen ? "text-[#d3d3d3]" : "text-[#36454f]"}`}>
                              <p className="leading-[24px]">Add</p>
                            </div>
                          </Wrapper8>
                        </div>
                      )}
                      {isMobileAndDefaultAndFrontBackAndIsSelectDocumentTypeDisabledAnd && (
                        <>
                          <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic overflow-hidden relative shrink-0 text-[#36454f] text-[16px] text-ellipsis whitespace-nowrap">{documentName}</p>
                          <Icon2 additionalClassNames="size-[16px]" />
                        </>
                      )}
                      {isMobileAndDefaultAndDefaultAndDefaultAndNotFrontBack && (
                        <>
                          <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[24px] min-h-px min-w-px not-italic overflow-hidden relative text-[#36454f] text-[16px] text-ellipsis whitespace-nowrap">{documentName}</p>
                          <DocumentUploadButtonsText1 text="Add">
                            <path d={svgPaths.p600ef00} fill="var(--fill-0, black)" id="Vector" />
                          </DocumentUploadButtonsText1>
                        </>
                      )}
                      {isMobileAndDefaultAndSelectDocumentTypeAndSelectedAndNotFront && (
                        <>
                          <button className="content-stretch cursor-pointer flex gap-[4px] items-center pr-[8px] relative rounded-[2px] shrink-0">
                            <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic overflow-hidden relative shrink-0 text-[#36454f] text-[16px] text-ellipsis text-left whitespace-nowrap">{documentName}</p>
                            <Icon2 additionalClassNames="size-[16px]" />
                          </button>
                          <DocumentUploadButtonsText1 text="Add">
                            <path d={svgPaths.p600ef00} fill="var(--fill-0, black)" id="Vector" />
                          </DocumentUploadButtonsText1>
                        </>
                      )}
                      {isMobileAndDefaultAndSelectDocumentTypeAndUploadedActiveAndNot && (
                        <>
                          <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic overflow-hidden relative shrink-0 text-[#36454f] text-[16px] text-ellipsis whitespace-nowrap">{`Balance Sheet `}</p>
                          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon">
                            <StyleDefaultDirectionDown />
                          </div>
                        </>
                      )}
                      {isMobileAndDefaultAndDefaultAndDisabledAndNotFrontBack && (
                        <>
                          <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#d3d3d3] text-[16px]">{documentName}</p>
                          <DocumentUploadButtonsText text="Add">
                            <path d={svgPaths.p600ef00} fill="var(--fill-0, black)" id="Vector" />
                          </DocumentUploadButtonsText>
                        </>
                      )}
                    </div>
                    {isMobileAndDefaultAndSelectDocumentTypeAndUploadedActiveAndNot && (
                      <DocumentUploadButtonsText1 text="Add">
                        <path d={svgPaths.p600ef00} fill="var(--fill-0, black)" id="Vector" />
                      </DocumentUploadButtonsText1>
                    )}
                  </div>
                )}
                {isLargeDesktopAndDefaultAndSelectDocumentTypeAndIsSelectedOr && (
                  <>
                    <p className="font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#36454f] text-[16px] whitespace-nowrap">{documentName}</p>
                    <Icon2 additionalClassNames="size-[24px]" />
                  </>
                )}
                {isMobileAndDefaultAndFrontBackAndIsSelectDocumentTypeDisabledAnd && (
                  <div className="relative shrink-0 w-full">
                    <div className="content-stretch flex flex-col gap-[4px] items-start px-[4px] relative w-full">
                      {isMobileAndDefaultAndSelectDocumentTypeDisabledAndSelectedAnd && (
                        <>
                          <Wrapper6>
                            <div className="content-stretch flex gap-[4px] items-center pr-[8px] relative rounded-[2px] shrink-0">
                              <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic overflow-hidden relative shrink-0 text-[#36454f] text-[16px] text-ellipsis whitespace-nowrap">Front</p>
                              <Icon2 additionalClassNames="size-[16px]" />
                            </div>
                            <DocumentUploadButtonsText1 text="Add">
                              <path d={svgPaths.p600ef00} fill="var(--fill-0, black)" id="Vector" />
                            </DocumentUploadButtonsText1>
                          </Wrapper6>
                          <Wrapper6>
                            <div className="content-stretch flex items-center pr-[8px] relative rounded-[2px] shrink-0">
                              <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic overflow-hidden relative shrink-0 text-[#36454f] text-[16px] text-ellipsis whitespace-nowrap">Back</p>
                            </div>
                            <DocumentUploadButtonsText1 text="Add">
                              <path d={svgPaths.p600ef00} fill="var(--fill-0, black)" id="Vector" />
                            </DocumentUploadButtonsText1>
                          </Wrapper6>
                        </>
                      )}
                      {isMobileAndDefaultAndSelectDocumentTypeAndUploadedActiveAndFront && (
                        <>
                          <DocumentStatesBase1 />
                          <DocumentStatesBase1 />
                        </>
                      )}
                    </div>
                  </div>
                )}
                {isLargeDesktopAndDefaultAndSelectDocumentTypeAndNotFrontBackAnd && (
                  <>
                    <p className={`leading-[24px] not-italic relative shrink-0 text-[#36454f] text-[16px] whitespace-nowrap ${isLargeDesktopAndDefaultAndSelectDocumentTypeAndOpenAndNotFront ? 'font-["Poppins:Regular",sans-serif]' : 'font-["Poppins:Medium",sans-serif]'}`}>Select document type</p>
                    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
                      {device === "Large desktop" && size === "Default" && type === "Select document type" && state === "Default" && !frontBack && (
                        <div className="absolute inset-0 overflow-clip" data-name="Style=Default, Direction=Down">
                          <Helper7 />
                        </div>
                      )}
                      {isLargeDesktopAndDefaultAndSelectDocumentTypeAndOpenAndNotFront && (
                        <div className="absolute inset-0 overflow-clip" data-name="Style=Default, Direction=Up">
                          <Helper6 />
                        </div>
                      )}
                    </div>
                  </>
                )}
                {isMobileAndDefaultAndSelectDocumentTypeAndUploadedInactiveAndNot && acceptableFileFormat && <Helper9 additionalClassNames="h-[16px] w-[342px]" acceptableFileLabel={acceptableFileLabel} />}
              </div>
            )}
            {device === "Mobile" && size === "Default" && ((type === "Default" && state === "Default" && !frontBack) || (type === "Select document type" && state === "Default" && !frontBack) || (type === "Select document type" && state === "Selected" && !frontBack) || (type === "Select document type disabled" && state === "Selected" && frontBack) || (type === "Select document type" && state === "Uploaded active" && frontBack) || (type === "Select document type" && state === "Open" && !frontBack)) && acceptableFileFormat && <Helper10 additionalClassNames="w-full" acceptableFileLabel={acceptableFileLabel} />}
            {isLargeDesktopAndDefaultAndNotFrontBackAndIsDefaultAndUploaded && documentName2 && <p className="font-['Poppins:Regular',sans-serif] leading-[24px] min-w-full not-italic relative shrink-0 text-[#36454f] text-[16px] w-[min-content]">{documentName}</p>}
            {isLargeDesktopAndDefaultAndNotFrontBackAndIsDefaultAndUploaded && (
              <div className={`bg-white relative rounded-[2px] shrink-0 w-full ${isLargeDesktopAndDefaultAndDefaultAndUploadedActiveAndNotFront ? "h-[112px]" : ""}`} data-name="Input_inner">
                <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
                  <div className={`content-stretch flex flex-col items-start justify-center px-[12px] relative ${isLargeDesktopAndDefaultAndDefaultAndUploadedActiveAndNotFront ? "gap-[4px] py-[24px] size-full" : isLargeDesktopAndSmallAndDefaultAndNotFrontBackAndIsUploaded ? "py-[8px] w-full" : "gap-[4px] py-[24px] w-full"}`}>
                    {device === "Large desktop" && size === "Default" && type === "Default" && !frontBack && ["Uploaded inactive", "Uploaded active"].includes(state) && (
                      <Wrapper13>
                        {isLargeDesktopAndDefaultAndDefaultAndUploadedInactiveAndNotFront && <DocumentUploadHelper />}
                        {isLargeDesktopAndDefaultAndDefaultAndUploadedActiveAndNotFront && <DocumentUploadHelper />}
                      </Wrapper13>
                    )}
                    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
                      <div className={`relative rounded-[2px] shrink-0 ${isLargeDesktopAndDefaultAndUploadedActiveAndNotFrontBackAndIs ? "bg-[#36454f]" : "bg-[#f0f0f0]"}`} data-name="Buttons">
                        <div className="flex flex-row items-center size-full">
                          <Wrapper1>
                            <div className={`flex flex-col font-["Poppins:Bold",sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right whitespace-nowrap ${isLargeDesktopAndDefaultAndUploadedActiveAndNotFrontBackAndIs ? "text-white" : "text-[#d3d3d3]"}`}>
                              <p className="leading-[24px]">Choose file</p>
                            </div>
                          </Wrapper1>
                        </div>
                      </div>
                      <p className={`flex-[1_0_0] font-["Poppins:Regular",sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[16px] ${isLargeDesktopAndDefaultAndUploadedActiveAndNotFrontBackAndIs ? "text-[#36454f]" : "text-[#d3d3d3]"}`}>or drop it here</p>
                    </div>
                  </div>
                </div>
                <div aria-hidden="true" className="absolute border border-[#8b8589] border-dashed inset-0 pointer-events-none rounded-[2px]" />
              </div>
            )}
            {isLargeDesktopAndDefaultAndNotFrontBackAndIsDefaultAndUploaded && acceptableFileFormat && <Text text="JPG, PNG or PDF, file size no more than 10MB" additionalClassNames="h-[16px] w-[310px]" />}
            {device === "Mobile" && size === "Default" && type === "Select document type" && !frontBack && ["Uploaded inactive", "Open"].includes(state) && (
              <div className={`content-stretch flex flex-col items-start ${isMobileAndDefaultAndSelectDocumentTypeAndOpenAndNotFrontBack ? "absolute bg-white left-[8px] py-[8px] rounded-[2px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)] top-[38px] w-[206px]" : "gap-[4px] relative shrink-0 w-full"}`}>
                {isMobileAndDefaultAndSelectDocumentTypeAndUploadedInactiveAndNot && (
                  <>
                    <Wrapper6>
                      <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center min-h-px min-w-px relative">
                        <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Icon">
                          <div className="absolute inset-0 overflow-clip" data-name="Type=PDF">
                            <Helper4 />
                          </div>
                        </div>
                        <p className="[text-decoration-skip-ink:none] decoration-solid flex-[1_0_0] font-['Poppins:SemiBold',sans-serif] leading-[16px] min-h-px min-w-px not-italic overflow-hidden relative text-[#000080] text-[14px] text-ellipsis underline whitespace-nowrap">balance_sheet.pdf</p>
                      </div>
                      <Wrapper12 additionalClassNames="bg-[#fffffe] rounded-[8px] size-[24px]">
                        <Helper />
                      </Wrapper12>
                    </Wrapper6>
                    <DocumentStatesBase1 />
                  </>
                )}
                {isMobileAndDefaultAndSelectDocumentTypeAndOpenAndNotFrontBack && (
                  <>
                    <DocumentUploadText text="Balance sheet" />
                    <DocumentUploadText text="Article of Association" />
                    <Text1 text="Shareholding Pattern" />
                    <Text1 text="Shareholding Pattern" />
                  </>
                )}
              </div>
            )}
            {isMobileAndDefaultAndDisabledAndNotFrontBackAndIsDefaultOrSelect && acceptableFileFormat && <Helper9 additionalClassNames="w-full" acceptableFileLabel={acceptableFileLabel} />}
            {isMobileAndDefaultAndDefaultAndUploadedActiveAndNotFrontBack && acceptableFileFormat && <Helper10 additionalClassNames="h-[16px] w-[342px]" acceptableFileLabel={acceptableFileLabel} />}
          </div>
        )}
        {((size === "Default" && type === "Select document type" && state === "Uploaded active" && !frontBack) || isDefaultAndDefaultAndUploadedActiveAndNotFrontBack || isLargeDesktopAndDefaultAndDefaultAndUploadedInactiveAndNotFront || isLargeDesktopAndSmallAndDefaultAndUploadedInactiveAndNotFront || isLargeDesktopAndSmallAndDefaultAndUploadedActiveAndNotFrontBack || (device === "Large desktop" && size === "Default" && type === "Select document type" && state === "Uploaded active" && frontBack) || isLargeDesktopAndDefaultAndSelectDocumentTypeAndSelectedAndFront || (device === "Large desktop" && size === "Default" && type === "Select document type" && state === "Uploaded inactive")) && (
          <div className={`content-stretch flex items-start relative shrink-0 ${isLargeDesktopAndDefaultAndSelectDocumentTypeAndIsUploadedActive ? "flex-col gap-[16px] w-full" : isLargeDesktopAndDefaultAndUploadedActiveAndNotFrontBackAndIs ? "flex-col gap-[4px] w-full" : device === "Large desktop" && type === "Default" && state === "Uploaded inactive" && !frontBack && ["Default", "Small"].includes(size) ? "flex-col w-full" : isMobileAndDefaultAndDefaultAndUploadedActiveAndNotFrontBack ? "flex-col gap-[2px] w-full" : "gap-[4px] w-[342px]"}`}>
            {type === "Default" && !frontBack && ((size === "Default" && state === "Uploaded active") || (device === "Large desktop" && size === "Default" && state === "Uploaded inactive") || (device === "Large desktop" && size === "Small" && state === "Uploaded inactive") || (device === "Large desktop" && size === "Small" && state === "Uploaded active")) && (
              <div className={`bg-[#fffff0] relative rounded-[8px] shrink-0 w-full ${isLargeDesktopAndSmallAndDefaultAndNotFrontBackAndIsUploaded ? "" : "h-[48px]"}`} data-name="Document states base">
                <div className="flex flex-row items-center size-full">
                  <div className={`content-stretch flex items-center justify-between p-[8px] relative ${isLargeDesktopAndSmallAndDefaultAndNotFrontBackAndIsUploaded ? "w-full" : "size-full"}`}>
                    <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center min-h-px min-w-px relative">
                      <div className={`overflow-clip relative shrink-0 ${isLargeDesktopAndSmallAndDefaultAndNotFrontBackAndIsUploaded ? "size-[16px]" : "size-[32px]"}`} data-name="Icon">
                        <TypePdf />
                      </div>
                      <div className={`relative shrink-0 ${isLargeDesktopAndSmallAndDefaultAndNotFrontBackAndIsUploaded ? "w-[118px]" : "w-[119px]"}`} data-name="Links">
                        <Helper5 />
                      </div>
                    </div>
                    <div className={`bg-[#fffffe] overflow-clip relative rounded-[8px] shrink-0 ${isLargeDesktopAndSmallAndDefaultAndNotFrontBackAndIsUploaded ? "size-[16px]" : "size-[24px]"}`} data-name="Icon">
                      <StyleDefault />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isLargeDesktopAndDefaultAndSelectDocumentTypeAndIsUploadedActive && (
              <div className={`content-stretch flex flex-col items-start relative shrink-0 ${isLargeDesktopAndDefaultAndSelectDocumentTypeAndNotFrontBackAnd1 ? "gap-[4px] w-full" : isLargeDesktopAndDefaultAndSelectDocumentTypeAndSelectedAndFront ? "gap-[4px]" : "gap-[8px]"}`}>
                {isLargeDesktopAndDefaultAndSelectDocumentTypeAndFrontBackAndIs && (
                  <>
                    <Text7 text="Front side" acceptableFileFormat={acceptableFileFormat}>
                      <div className={`relative rounded-[2px] shrink-0 ${isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive ? "bg-[#f0f0f0]" : "bg-[#36454f]"}`} data-name="Buttons">
                        <div className="flex flex-row items-center size-full">
                          <Wrapper1>
                            <div className={`flex flex-col font-["Poppins:Bold",sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right whitespace-nowrap ${isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive ? "text-[#d3d3d3]" : "text-white"}`}>
                              <p className="leading-[24px]">Choose file</p>
                            </div>
                          </Wrapper1>
                        </div>
                      </div>
                      <p className={`flex-[1_0_0] font-["Poppins:Regular",sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[16px] ${isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive ? "text-[#d3d3d3]" : "text-[#36454f]"}`}>or drop it here</p>
                    </Text7>
                    <DocumentStatesBase1 />
                  </>
                )}
                {isLargeDesktopAndDefaultAndSelectDocumentTypeAndNotFrontBackAnd1 && (
                  <div className="bg-white relative rounded-[2px] shrink-0 w-full" data-name="Input_inner">
                    <div className={`flex flex-col overflow-clip rounded-[inherit] size-full ${isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive1 ? "justify-center" : "justify-end"}`}>
                      <div className={`content-stretch flex flex-col gap-[4px] items-start px-[12px] py-[24px] relative w-full ${isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive1 ? "justify-center" : "justify-end"}`}>
                        <Icon3 />
                        <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
                          <div className={`relative rounded-[2px] shrink-0 ${isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive1 ? "bg-[#f0f0f0]" : "bg-[#36454f]"}`} data-name="Buttons">
                            <div className="flex flex-row items-center size-full">
                              <Wrapper1>
                                <div className={`flex flex-col font-["Poppins:Bold",sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right whitespace-nowrap ${isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive1 ? "text-[#d3d3d3]" : "text-white"}`}>
                                  <p className="leading-[24px]">Choose file</p>
                                </div>
                              </Wrapper1>
                            </div>
                          </div>
                          <p className={`flex-[1_0_0] font-["Poppins:Regular",sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[16px] ${isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive1 ? "text-[#d3d3d3]" : "text-[#36454f]"}`}>or drop it here</p>
                        </div>
                      </div>
                    </div>
                    <div aria-hidden="true" className="absolute border border-[#8b8589] border-dashed inset-0 pointer-events-none rounded-[2px]" />
                  </div>
                )}
                {isLargeDesktopAndDefaultAndSelectDocumentTypeAndNotFrontBackAnd1 && acceptableFileFormat && <Text text="JPG, PNG or PDF, file size no more than 10MB" additionalClassNames="h-[16px] w-[310px]" />}
                {isLargeDesktopAndDefaultAndSelectDocumentTypeAndSelectedAndFront && (
                  <>
                    <p className="font-['Poppins:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#8b8589] text-[12px] w-[310px]">Front side</p>
                    <Text2 text="or drop it here" acceptableFileFormat={acceptableFileFormat} />
                  </>
                )}
              </div>
            )}
            {device === "Large desktop" && size === "Default" && type === "Select document type" && (state === "Uploaded active" || (state === "Selected" && frontBack) || (state === "Uploaded inactive" && frontBack)) && (
              <div className={`content-stretch flex flex-col items-start relative shrink-0 ${isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedActive ? "gap-[4px] w-full" : isLargeDesktopAndDefaultAndSelectDocumentTypeAndSelectedAndFront ? "gap-[4px]" : "gap-[8px] w-full"}`}>
                {isLargeDesktopAndDefaultAndSelectDocumentTypeAndFrontBackAndIs && (
                  <Text7 text="Back side" acceptableFileFormat={acceptableFileFormat}>
                    <div className={`relative rounded-[2px] shrink-0 ${isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive ? "bg-[#f0f0f0]" : "bg-[#36454f]"}`} data-name="Buttons">
                      <div className="flex flex-row items-center size-full">
                        <Wrapper1>
                          <div className={`flex flex-col font-["Poppins:Bold",sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right whitespace-nowrap ${isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive ? "text-[#d3d3d3]" : "text-white"}`}>
                            <p className="leading-[24px]">Choose file</p>
                          </div>
                        </Wrapper1>
                      </div>
                    </div>
                    <p className={`flex-[1_0_0] font-["Poppins:Regular",sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[16px] ${isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive ? "text-[#d3d3d3]" : "text-[#36454f]"}`}>or drop it here</p>
                  </Text7>
                )}
                {device === "Large desktop" && size === "Default" && type === "Select document type" && state === "Uploaded active" && <DocumentStatesBase1 />}
                {isLargeDesktopAndDefaultAndSelectDocumentTypeAndSelectedAndFront && (
                  <>
                    <p className="font-['Poppins:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#8b8589] text-[12px] w-[310px]">Back side</p>
                    <Text2 text="or drop it here" acceptableFileFormat={acceptableFileFormat} />
                  </>
                )}
                {isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive && (
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                    <DocumentStatesBase1 />
                  </div>
                )}
                {isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedActive && <DocumentStatesBase1 />}
              </div>
            )}
            {type === "Default" && state === "Uploaded active" && !frontBack && (size === "Default" || (device === "Large desktop" && size === "Small")) && (
              <div className={`bg-[#fffff0] relative rounded-[8px] shrink-0 w-full ${isLargeDesktopAndSmallAndDefaultAndUploadedActiveAndNotFrontBack ? "" : "h-[48px]"}`} data-name="Document states base">
                <div className="flex flex-row items-center size-full">
                  <div className={`content-stretch flex items-center justify-between p-[8px] relative ${isLargeDesktopAndSmallAndDefaultAndUploadedActiveAndNotFrontBack ? "w-full" : "size-full"}`}>
                    <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center min-h-px min-w-px relative">
                      <div className={`overflow-clip relative shrink-0 ${isLargeDesktopAndSmallAndDefaultAndUploadedActiveAndNotFrontBack ? "size-[16px]" : "size-[32px]"}`} data-name="Icon">
                        <TypePdf />
                      </div>
                      <div className={`relative shrink-0 ${isLargeDesktopAndSmallAndDefaultAndUploadedActiveAndNotFrontBack ? "w-[118px]" : "w-[119px]"}`} data-name="Links">
                        <Helper5 />
                      </div>
                    </div>
                    <div className={`bg-[#fffffe] overflow-clip relative rounded-[8px] shrink-0 ${isLargeDesktopAndSmallAndDefaultAndUploadedActiveAndNotFrontBack ? "size-[16px]" : "size-[24px]"}`} data-name="Icon">
                      <StyleDefault />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isMobileAndDefaultAndSelectDocumentTypeAndUploadedActiveAndNot && (
              <>
                <button className="cursor-pointer relative shrink-0" data-name="Info">
                  <Helper8 />
                </button>
                <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[#8b8589] text-[12px]">JPG, PNG or PDF, file size no more than 10MB</p>
              </>
            )}
            {isMobileAndDefaultAndDefaultAndUploadedActiveAndNotFrontBack && <DocumentStatesBase1 />}
            {isLargeDesktopAndDefaultAndSelectDocumentTypeAndUploadedInactive1 && <DocumentStatesBase1 />}
          </div>
        )}
        {device === "Large desktop" && type === "Default" && !frontBack && ((size === "Default" && state === "Error") || (size === "Default" && state === "Disabled") || (size === "Default" && state === "Default") || (size === "Small" && state === "Default") || (size === "Small" && state === "Disabled")) && documentName2 && <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#36454f] text-[16px] w-full">{documentName}</p>}
        {device === "Large desktop" && !frontBack && ((size === "Default" && type === "Select document type" && state === "Default") || (size === "Default" && type === "Select document type" && state === "Selected") || (size === "Default" && type === "Default" && state === "Error") || (size === "Default" && type === "Default" && state === "Disabled") || (size === "Default" && type === "Default" && state === "Default") || (size === "Small" && type === "Default" && state === "Default") || (size === "Small" && type === "Default" && state === "Disabled") || (size === "Default" && type === "Select document type" && state === "Open")) && (
          <div className="bg-white relative rounded-[2px] shrink-0 w-full" data-name="Input_inner">
            <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
              <div className={`content-stretch flex flex-col items-start justify-center px-[12px] relative w-full ${device === "Large desktop" && size === "Small" && type === "Default" && !frontBack && ["Default", "Disabled"].includes(state) ? "py-[8px]" : "gap-[4px] py-[24px]"}`}>
                {device === "Large desktop" && size === "Default" && !frontBack && ((type === "Select document type" && state === "Default") || (type === "Select document type" && state === "Selected") || (type === "Default" && state === "Error") || (type === "Default" && state === "Disabled") || (type === "Default" && state === "Default") || (type === "Select document type" && state === "Open")) && <Icon3 />}
                <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
                  <div className={`relative rounded-[2px] shrink-0 ${isLargeDesktopAndNotFrontBackAndIsDefaultAndSelectDocumentType ? "bg-[#36454f]" : "bg-[#f0f0f0]"}`} data-name="Buttons">
                    <div className="flex flex-row items-center size-full">
                      <Wrapper1>
                        <div className={`flex flex-col font-["Poppins:Bold",sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right whitespace-nowrap ${isLargeDesktopAndNotFrontBackAndIsDefaultAndSelectDocumentType ? "text-white" : "text-[#d3d3d3]"}`}>
                          <p className="leading-[24px]">Choose file</p>
                        </div>
                      </Wrapper1>
                    </div>
                  </div>
                  <p className={`flex-[1_0_0] font-["Poppins:Regular",sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[16px] ${isLargeDesktopAndNotFrontBackAndIsDefaultAndSelectDocumentType ? "text-[#36454f]" : "text-[#d3d3d3]"}`}>or drop it here</p>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className={`absolute border border-dashed inset-0 pointer-events-none rounded-[2px] ${device === "Large desktop" && type === "Default" && state === "Disabled" && !frontBack && ["Default", "Small"].includes(size) ? "border-[#d3d3d3]" : isLargeDesktopAndDefaultAndDefaultAndErrorAndNotFrontBack ? "border-[red]" : "border-[#8b8589]"}`} />
          </div>
        )}
        {device === "Large desktop" && !frontBack && ((size === "Default" && type === "Select document type" && state === "Default") || (size === "Default" && type === "Select document type" && state === "Selected") || (size === "Default" && type === "Default" && state === "Disabled") || (size === "Default" && type === "Default" && state === "Default") || (size === "Small" && type === "Default" && state === "Disabled") || (size === "Default" && type === "Select document type" && state === "Open")) && acceptableFileFormat && <Text text="JPG, PNG or PDF, file size no more than 10MB" additionalClassNames="w-full" />}
        {isLargeDesktopAndDefaultAndHoverAndNotFrontBackAndIsDefaultOr && documentName2 && <p className="font-['Poppins:Regular',sans-serif] leading-[24px] min-w-full not-italic relative shrink-0 text-[#36454f] text-[16px] w-[min-content]">{documentName}</p>}
        {isLargeDesktopAndDefaultAndHoverAndNotFrontBackAndIsDefaultOr && (
          <div className="bg-[#fffff0] relative rounded-[2px] shrink-0 w-full" data-name="Input_inner">
            <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
              <div className={`content-stretch flex flex-col items-start justify-center px-[12px] relative w-full ${device === "Large desktop" && size === "Small" && type === "Default" && state === "Hover" && !frontBack ? "py-[8px]" : "gap-[4px] py-[24px]"}`}>
                {device === "Large desktop" && size === "Default" && type === "Default" && state === "Hover" && !frontBack && <Icon3 />}
                <Text3 text="or drop it here" />
              </div>
            </div>
            <div aria-hidden="true" className="absolute border-2 border-[#000080] border-dashed inset-0 pointer-events-none rounded-[2px]" />
          </div>
        )}
        {isLargeDesktopAndDefaultAndHoverAndNotFrontBackAndIsDefaultOr && acceptableFileFormat && <Text text="JPG, PNG or PDF, file size no more than 10MB" additionalClassNames="h-[16px] w-[310px]" />}
        {isLargeDesktopAndDefaultAndDefaultAndErrorAndNotFrontBack && acceptableFileFormat && (
          <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
            <button className="cursor-pointer relative shrink-0" data-name="Info">
              <Helper8 />
            </button>
            <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[12px] text-[red]">JPG, PNG or PDF, file size no more than 10MB</p>
          </div>
        )}
        {device === "Large desktop" && size === "Small" && type === "Default" && state === "Default" && !frontBack && acceptableFileFormat && (
          <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
            <button className="cursor-pointer relative shrink-0" data-name="Info">
              <Wrapper14>
                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon">
                  <div className="absolute inset-0 overflow-clip" data-name="Sharp-solid / Info">
                    <div className="absolute inset-[16.67%]" data-name="Primary">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
                        <path d={svgPaths.p2f444300} fill="var(--fill-0, #8B8589)" id="Primary" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Wrapper14>
            </button>
            <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[#8b8589] text-[12px]">JPG, PNG or PDF, file size no more than 10MB</p>
          </div>
        )}
        {isLargeDesktopAndDefaultAndSelectDocumentTypeAndOpenAndNotFront && (
          <div className="absolute bg-white content-stretch flex flex-col items-start left-0 pt-[8px] rounded-[2px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)] top-[24px] w-[261px]">
            <DocumentUploadText text="Balance sheet" />
            <DocumentUploadText text="Article of Association" />
            <DocumentUploadText text="Shareholding Pattern" additionalClassNames="pb-[8px]" />
          </div>
        )}
        {isLargeDesktopAndBigAndDefaultAndErrorAndNotFrontBack && (
          <div className="h-[72px] relative shrink-0 w-full" data-name="Document Upload">
            <div aria-hidden="true" className="absolute border border-[red] border-dashed inset-0 pointer-events-none" />
            <div className="absolute content-stretch flex items-center justify-between left-[8px] top-[16px] w-[768px]">
              <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
                <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">
                  <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
                    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0">
                      <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#36454f] text-[16px] whitespace-nowrap">
                        <p className="leading-[24px]">Aditya Birla Finance Ltd.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Wrapper15 additionalClassNames="gap-[2px]">
                <Text4 text="or drop it here" />
                {acceptableFileFormat && (
                  <div className="content-stretch flex gap-[4px] h-[16px] items-start relative shrink-0 w-[310px]">
                    <button className="cursor-pointer relative shrink-0" data-name="Info">
                      <Helper8 />
                    </button>
                    <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[10px] text-[red]">JPG, PNG or PDF, file size no more than 10MB</p>
                  </div>
                )}
              </Wrapper15>
            </div>
          </div>
        )}
      </div>
      {!frontBack && ((device === "Mobile" && size === "Default" && type === "Select document type" && state === "Uploaded active") || (device === "Large desktop" && size === "Big" && type === "Default" && state === "Default") || (device === "Large desktop" && size === "Big" && type === "Select document type" && state === "Selected") || (device === "Large desktop" && size === "Big" && type === "Default" && state === "Uploaded inactive") || (device === "Large desktop" && size === "Big" && type === "Default" && state === "Hover")) && (
        <div className={`flex flex-col ${isLargeDesktopAndBigAndNotFrontBackAndIsDefaultAndDefaultOr ? "justify-center size-full" : "absolute content-stretch gap-[4px] inset-[35.59%_0_0_0] items-start"}`}>
          {isLargeDesktopAndBigAndNotFrontBackAndIsDefaultAndDefaultOr && (
            <div className={`content-stretch flex flex-col items-start justify-center px-[8px] py-[16px] relative w-full ${isLargeDesktopAndBigAndDefaultAndUploadedInactiveAndNotFrontBack ? "gap-[16px]" : ""}`}>
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                <div className={`content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative ${isLargeDesktopAndBigAndDefaultAndUploadedInactiveAndNotFrontBack ? "" : "gap-[8px]"}`}>
                  <div className={`content-stretch flex relative shrink-0 ${isLargeDesktopAndBigAndDefaultAndNotFrontBackAndIsUploaded ? "gap-[8px] items-center" : "flex-col items-start justify-center"}`}>
                    <div className={`flex flex-col justify-center relative shrink-0 ${isLargeDesktopAndBigAndDefaultAndNotFrontBackAndIsUploaded ? "content-stretch items-start" : 'font-["Poppins:Medium",sans-serif] leading-[0] not-italic text-[#36454f] text-[16px] whitespace-nowrap'}`}>
                      {isLargeDesktopAndBigAndNotFrontBackAndIsDefaultAndDefaultOr1 && <p className="leading-[24px]">Aditya Birla Finance Ltd.</p>}
                      {isLargeDesktopAndBigAndDefaultAndNotFrontBackAndIsUploaded && (
                        <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#36454f] text-[16px] whitespace-nowrap">
                          <p className="leading-[24px]">Aditya Birla Finance Ltd.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`content-stretch flex flex-col items-start relative shrink-0 w-[310px] ${isLargeDesktopAndBigAndDefaultAndUploadedInactiveAndNotFrontBack ? "gap-[4px]" : ""}`}>
                  {device === "Large desktop" && size === "Big" && !frontBack && ((type === "Default" && state === "Default") || (type === "Select document type" && state === "Selected") || (type === "Default" && state === "Uploaded inactive")) && (
                    <div className="content-stretch flex flex-col gap-[2px] items-end justify-center overflow-clip relative rounded-[2px] shrink-0 w-full" data-name="Input_inner">
                      <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                        <div className={`relative rounded-[2px] shrink-0 ${isLargeDesktopAndBigAndDefaultAndUploadedInactiveAndNotFrontBack ? "bg-[#f0f0f0]" : "bg-[#36454f]"}`} data-name="Buttons">
                          <div className="flex flex-row items-center size-full">
                            <Wrapper1>
                              <div className={`flex flex-col font-["Poppins:Bold",sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right whitespace-nowrap ${isLargeDesktopAndBigAndDefaultAndUploadedInactiveAndNotFrontBack ? "text-[#d3d3d3]" : "text-white"}`}>
                                <p className="leading-[24px]">Choose file</p>
                              </div>
                            </Wrapper1>
                          </div>
                        </div>
                        <p className={`font-["Poppins:Regular",sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] whitespace-nowrap ${isLargeDesktopAndBigAndDefaultAndUploadedInactiveAndNotFrontBack ? "text-[#d3d3d3]" : "text-[#36454f]"}`}>or drop it here</p>
                      </div>
                      {isLargeDesktopAndBigAndNotFrontBackAndIsDefaultAndDefaultOr1 && acceptableFileFormat && <Text5 text="JPG, PNG or PDF, file size no more than 10MB" />}
                      {isLargeDesktopAndBigAndDefaultAndUploadedInactiveAndNotFrontBack && acceptableFileFormat && (
                        <div className="content-stretch flex gap-[4px] h-[16px] items-start relative shrink-0 w-[310px]">
                          <button className="cursor-pointer relative shrink-0" data-name="Info">
                            <Helper8 />
                          </button>
                          <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[#d3d3d3] text-[10px]">JPG, PNG or PDF, file size no more than 10MB</p>
                        </div>
                      )}
                    </div>
                  )}
                  {isLargeDesktopAndBigAndDefaultAndHoverAndNotFrontBack && (
                    <Wrapper16>
                      <Text4 text="or drop it here" />
                      {acceptableFileFormat && <Text5 text="JPG, PNG or PDF, file size no more than 10MB" />}
                    </Wrapper16>
                  )}
                </div>
              </div>
              {isLargeDesktopAndBigAndDefaultAndUploadedInactiveAndNotFrontBack && <DocumentStatesBase className="bg-[#fffff0] relative rounded-[8px] shrink-0 w-full" size="Small" states="Default" />}
            </div>
          )}
          {isMobileAndDefaultAndSelectDocumentTypeAndUploadedActiveAndNot && (
            <>
              <DocumentStates />
              <DocumentStates />
              <DocumentStates />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function Modal() {
  return (
    <div className="bg-[#fffffe] content-stretch flex flex-col items-start px-[24px] relative shadow-[0px_-4px_10px_0px_rgba(0,0,0,0.25)] size-full" data-name="Modal">
      <div className="relative shrink-0 w-full" data-name="Modal/Header">
        <div className="flex flex-row justify-center size-full">
          <div className="content-stretch flex gap-[8px] items-start justify-center py-[16px] relative w-full">
            <p className="flex-[1_0_0] font-['Poppins:Bold',sans-serif] leading-[32px] min-h-px min-w-px not-italic relative text-[#36454f] text-[24px]">FY 2025-26 (till date)</p>
            <Wrapper12 additionalClassNames="size-[32px]">
              <div className="absolute inset-[16.67%]" data-name="">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.3333 21.3333">
                  <path d={svgPaths.p3863c600} fill="var(--fill-0, black)" id="ï" />
                </svg>
              </div>
            </Wrapper12>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col h-[342px] items-start overflow-x-clip overflow-y-auto pb-[16px] pt-[8px] relative shrink-0 w-full">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
          <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0">
            <div className="content-stretch flex gap-[16px] h-[72px] items-center py-[16px] relative shrink-0 w-[639px]" data-name="List-item">
              <div aria-hidden="true" className="absolute border-[#f0f0f0] border-solid border-t inset-0 pointer-events-none" />
              <Text6 text="Corporate Tax Return (CT Return)" />
              <DocumentUpload acceptableFileFormat={false} className="relative shrink-0 w-[310px]" device="Large desktop" documentName2={false} size="Small" />
            </div>
            <div className="content-stretch flex gap-[16px] h-[72px] items-center py-[16px] relative shrink-0 w-[639px]" data-name="List-item">
              <div aria-hidden="true" className="absolute border-[#f0f0f0] border-solid border-t inset-0 pointer-events-none" />
              <Text6 text="External Auditor’s Report" />
              <DocumentUpload acceptableFileFormat={false} className="relative shrink-0 w-[310px]" device="Large desktop" documentName2={false} size="Small" />
            </div>
            <div className="content-stretch flex gap-[16px] h-[72px] items-center py-[16px] relative shrink-0 w-[639px]" data-name="List-item">
              <div aria-hidden="true" className="absolute border-[#f0f0f0] border-solid border-t inset-0 pointer-events-none" />
              <Text6 text="Accounting Schedule" />
              <DocumentUpload acceptableFileFormat={false} className="relative shrink-0 w-[310px]" device="Large desktop" documentName2={false} size="Small" />
            </div>
          </div>
          <div className="content-stretch flex gap-[16px] items-center pb-[16px] pt-[32px] relative shrink-0 w-full" data-name="List-item">
            <div aria-hidden="true" className="absolute border-[#d3d3d3] border-solid border-t inset-0 pointer-events-none" />
            <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
              <div className="flex flex-[1_0_0] flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#8b8589] text-[16px]">
                <p className="leading-[24px]">Add consolidated document</p>
              </div>
            </div>
            <DocumentUpload acceptableFileFormat={false} className="relative shrink-0 w-[310px]" device="Large desktop" documentName2={false} size="Small" />
            <div className="absolute bg-white content-stretch flex flex-col items-center justify-center left-[290px] px-[4px] top-[-12px]">
              <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#d3d3d3] text-[16px] whitespace-nowrap">
                <p className="leading-[24px]">or</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="Modal/Footer">
        <div aria-hidden="true" className="absolute border-[#f0f0f0] border-solid border-t inset-0 pointer-events-none" />
        <div className="flex flex-row items-center justify-end size-full">
          <div className="content-stretch flex gap-[16px] items-center justify-end py-[16px] relative w-full">
            <div className="relative rounded-[2px] shrink-0" data-name="Buttons">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[8px] items-center relative">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                    <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#36454f] text-[14px] text-right whitespace-nowrap">
                      <p className="leading-[24px]">Go back</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#f0f0f0] relative rounded-[2px] shrink-0" data-name="Buttons">
              <Wrapper11>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                  <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#d3d3d3] text-[16px] text-right whitespace-nowrap">
                    <p className="leading-[24px]">Save</p>
                  </div>
                </div>
              </Wrapper11>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}