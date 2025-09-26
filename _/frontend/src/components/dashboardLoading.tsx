import { Card, Image, Skeleton } from "@heroui/react";
import { ReactElement } from "react";

export default function DashboardPending(): ReactElement {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div>
          <Image
            src="https://lcx.co.za/wp-content/uploads/2024/12/thumbnail.png"
            className="h-[8rem]"
          />
          <div className="loader my-2 bg-gray-100">
            <div className="inner_loader"></div>
          </div>
        </div>
      </div>
    </>
  );
}
