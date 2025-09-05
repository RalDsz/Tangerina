import HiroshimaDropZone from "@/components/HiroshimaDropZone"

function scans() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6">
      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-10">
        <HiroshimaDropZone />
      </div>
    </div>
  )
}

export default scans
