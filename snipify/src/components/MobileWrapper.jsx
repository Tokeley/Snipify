const MobileWrapper = ({ children }) => {
    return (
        <div 
            className="w-screen h-screen place-items-center bg-neutral-100"
            style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%23d4d4d4'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
            }}
        >
            <div className="min-h-screen w-full px-4 overflow-y-auto  flex flex-col items-center justify-center">
                {children}
            </div>
        </div>
    );
  };
  
  export default MobileWrapper;
  