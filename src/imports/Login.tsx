import clsx from "clsx";
import svgPaths from "./svg-dvvx1hklyq";
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div style={{ "--transform-inner-width": "1200", "--transform-inner-height": "22" } as React.CSSProperties} className={clsx("flex items-center justify-center relative shrink-0", additionalClassNames)}>
      <div className="flex-none rotate-[-0.52deg]">{children}</div>
    </div>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <div className="absolute bg-white border border-[#ccc] border-solid inset-[35.09%_0_-5.26%_0.27%] overflow-clip rounded-[5px]">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[14px] not-italic text-[#333] text-[14px] top-[calc(50%-5px)] whitespace-nowrap">{text}</p>
    </div>
  );
}

export default function Login() {
  return (
    <div className="bg-white relative size-full" data-name="Login">
      <div className="absolute bg-[#312b6b] h-[785px] left-0 top-0 w-[701px]" />
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[calc(8.33%-15px)] not-italic text-[14px] text-white top-[674px] w-[488px]">Your information is secured with 256-bit encryption across systems.</p>
      <div className="absolute content-stretch flex flex-col gap-[6px] items-center left-[calc(8.33%-15px)] top-[605.07px] w-[47px]">
        <Wrapper additionalClassNames="h-[27.998px] w-[21.218px]">
          <div className="h-[27.809px] relative w-[20.966px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.9664 27.809">
              <g id="Group 41655">
                <path d={svgPaths.p1cc0ef80} fill="var(--fill-0, white)" id="Vector" />
                <path d={svgPaths.p2aae4180} fill="var(--fill-0, white)" id="Vector_2" />
              </g>
            </svg>
          </div>
        </Wrapper>
        <p className="font-['Poppins:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[12px] text-white uppercase w-[min-content]">Private</p>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[6px] items-center left-[calc(8.33%+62px)] top-[605.03px] w-[51px]">
        <Wrapper additionalClassNames="h-[28.072px] w-[27.929px]">
          <div className="h-[27.822px] relative w-[27.678px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.678 27.822">
              <g id="Group 41656">
                <path d={svgPaths.p89508b0} fill="var(--fill-0, white)" id="Vector" />
                <path d={svgPaths.p18aa4000} fill="var(--fill-0, white)" id="Vector_2" />
                <path d={svgPaths.p14813a40} fill="var(--fill-0, white)" id="Vector_3" />
              </g>
            </svg>
          </div>
        </Wrapper>
        <p className="font-['Poppins:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[12px] text-white uppercase w-[min-content]">Trusted</p>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[6px] items-center left-[calc(16.67%+9px)] top-[605px] w-[45px]">
        <Wrapper additionalClassNames="h-[28.134px] w-[23.708px]">
          <div className="h-[27.922px] relative w-[23.456px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.4559 27.9221">
              <g id="Group 41657">
                <path d={svgPaths.p1cb80280} fill="var(--fill-0, white)" id="Vector" />
                <path d={svgPaths.p23413000} fill="var(--fill-0, white)" id="Vector_2" />
              </g>
            </svg>
          </div>
        </Wrapper>
        <p className="font-['Poppins:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[12px] text-white uppercase w-[min-content]">Secure</p>
      </div>
      <div className="-translate-y-1/2 absolute h-[30px] left-[calc(8.33%-15px)] overflow-clip top-[calc(50%-301.5px)] w-[122px]" data-name="Choice-Loog 2">
        <div className="absolute inset-[-422.47%_-84.89%_-346.83%_-85.08%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <g id="Vector" />
          </svg>
        </div>
        <div className="absolute h-[41px] left-0 top-0 w-[105px]" data-name="capitalxb_logo 1">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 105 41">
            <g id="capitalxb_logo 1">
              <path d={svgPaths.p1e4cc200} fill="var(--fill-0, white)" id="Vector" />
              <path d={svgPaths.p14236e00} fill="var(--fill-0, white)" id="Vector_2" />
              <path d={svgPaths.p1e9e6700} fill="var(--fill-0, #21B16C)" id="Vector_3" />
            </g>
          </svg>
        </div>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[calc(8.33%-15px)] not-italic text-[24px] text-white top-[162px] w-[488px]">{`Streamlining the lending operations with enhanced precision and efficiency with access to powerful tools and insights."`}</p>
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[calc(8.33%-15px)] not-italic opacity-70 text-[20px] text-white top-[322px] w-[488px]">Facilitating a seamless loan processing and elevating the lending experience to new heights.</p>
      <div className="absolute bg-[#f0f0f0] bottom-0 h-[48px] left-0 w-[1440px]" data-name="Footer">
        <div aria-hidden="true" className="absolute border-[#d3d3d3] border-solid border-t inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center justify-between px-[50px] py-[8px] relative size-full">
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
                  <p className="font-['Poppins:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#8b8589] text-[12px] whitespace-nowrap">2025 Choice Finserv. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col items-start left-[calc(58.33%+42px)] top-[124px]">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[48px] not-italic relative shrink-0 text-[#404040] text-[30px] whitespace-nowrap">Signup</p>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[calc(58.33%+42px)] top-[203px] w-[377px]">
        <div className="h-[57px] relative shrink-0 w-full" data-name="Component 161">
          <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#333] text-[14px] top-0 whitespace-nowrap">Company name</p>
          <Text text="ABC Manufacturing Ltd" />
        </div>
        <div className="h-[57px] relative shrink-0 w-full" data-name="Component 164">
          <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#333] text-[14px] top-0 whitespace-nowrap">Email Address</p>
          <Text text="admin1@b2cdev.com" />
        </div>
        <div className="h-[57px] relative shrink-0 w-full" data-name="Component 165">
          <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#333] text-[14px] top-0 whitespace-nowrap">Mobile number</p>
          <Text text="+91 - 9876598765" />
        </div>
      </div>
      <div className="absolute bg-[#0066b8] left-[calc(66.67%+46px)] rounded-[5px] top-[491px] w-[130px]" data-name="Component 163">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[20px] py-[10px] relative w-full">
            <p className="font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">Signup</p>
          </div>
        </div>
      </div>
    </div>
  );
}