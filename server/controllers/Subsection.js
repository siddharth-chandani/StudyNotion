// Import necessary modules
const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const User = require("../models/User")
const { uploadToCloudinary } = require("../utils/cloudinaryUploader")
const cloudinary = require("cloudinary").v2;
const { ACCOUNT_TYPE } = require("../utils/constants")

// Create a new sub-section for a given section
exports.createSubSection = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { sectionId, title, description } = req.body
    const video = req.files.video

    // Check if all necessary fields are provided
    if (!sectionId || !title || !description || !video) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" })
    }
    console.log(video)

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadToCloudinary(
      video,
      process.env.FOLDER_NAME
    )
    console.log(uploadDetails)
    // Create a new sub-section with the necessary information
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.public_id,
    })

    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection")

    // Return the updated section in the response
    return res.status(200).json({ success: true, data: updatedSection })
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body
    const subSection = await SubSection.findById(subSectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.public_id
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    console.log("updated section", updatedSection)

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }
}

exports.getSignedVideoUrl = async (req, res) => {
  try {
    const { courseId, subSectionId } = req.body;

    const userDetails = await User.findOne({ email: req.user.email });

    if (!courseId || !subSectionId) {
      return res.status(400).json({ success: false, message: "Missing courseId or subSectionId" });
    }
    console.log("Getting signed URL for courseId:", courseId, "subSectionId:", subSectionId);
    // 1. Find the subsection
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({ success: false, message: "SubSection not found" });
    }

    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
    // 2. return if this user is not enrolled / allowed to view
    if (courseDetails && userDetails.accountType === ACCOUNT_TYPE.STUDENT) {
          const uid = new mongoose.Types.ObjectId(userId);
          if (!courseDetails.studentsEnrolled || !courseDetails.studentsEnrolled.includes(uid)) {
             // User is not enrolled in the course
            return res.status(403).json({
              success: false,
              message: "You are not enrolled in this course",
            })
             }
        }

        // check if the couse belongs to the instructor
    if (courseDetails && userDetails.accountType === ACCOUNT_TYPE.INSTRUCTOR) {

      if (!userDetails.courses || !userDetails.courses.includes(courseDetails._id)) {
        return res.status(403).json({
          success: false,
          message: "You are not instructor of this course",
        })
         }
    } 

    console.log("Generating signed URL for video:", subSection.videoUrl);
    // 3. Generate signed URL (valid for 60s)
    const expiresAt = Math.floor(Date.now() / 1000) + 60;
  const signedUrl = cloudinary.url(subSection.videoUrl + ".m3u8", {
    resource_type: "video",
    type: "authenticated",
    sign_url: true,
    expires_at: expiresAt,
    secure: true,
  });
console.log("Generated signed URL:", signedUrl);
    return res.json({ success: true, url: signedUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error generating signed URL" });
  }
};