# Video-Verse API

## Description

The Video-Verse API provides functionalities for managing video files. It allows users to upload, trim, and merge videos, all while ensuring that API calls are authenticated with static API tokens.

## Features

1. **Upload Videos**: Upload video files with configurable size and duration limits.
2. **Trim Videos**: Trim videos to shorten them from the start or end.
3. **Merge Videos**: Merge multiple video clips into a single video file.
4. **Authentication**: All API calls are authenticated using static API tokens.

## Installation

1. **Clone the Repository**

    ```bash
    git clone <repository-url>
    ```

2. **Navigate to the Project Directory**

    ```bash
    cd <project-directory>
    ```

3. **Install Dependencies**

    ```bash
    npm install
    ```

4. **Start the Application**

    ```bash
    npm run start
    ```

    The application will run on `http://localhost:3000`.

## API Endpoints

### Upload Video

- **Endpoint**: `/videos/upload`
- **Method**: `POST`
- **Description**: Upload a video file with additional metadata.
- **Request**: 
  - **Form Data**: `file` (required), `title`, `description`
  - **File Size Limit**: 25MB
  - **File Type**: Video files only

### Trim Video

- **Endpoint**: `/videos/:id/trim`
- **Method**: `POST`
- **Description**: Trim an existing video from a specified start time to an end time.
- **Request**: 
  - **Path Parameter**: `id` (Video ID)
  - **Body**: `startTime`, `endTime`
- **Validation**: Start time must be less than end time and within video duration.

### Merge Videos

- **Endpoint**: `/videos/merge`
- **Method**: `POST`
- **Description**: Merge multiple video clips into a single video file.
- **Request**: 
  - **Body**: `videoIds` (Array of Video IDs)
  
## Share Video

**Endpoint**: `/videos/:id/share`  
**Method**: POST  
**Description**: Generates a shareable link for a video with a time-based expiry.

**Request**:
- **Path Parameter**:
  - `id` (number): The unique identifier of the video to be shared.
- **Body**:
  - `expiresIn` (number): The time in milliseconds for which the link will be valid. Must be a positive integer.

**Validation**:
- The `expiresIn` value must be a positive integer. A `400 Bad Request` error will be returned if this condition is not met.

**Responses**:
- **200 OK**: Returns a success message with the generated shareable link.
- **400 Bad Request**: If `expiresIn` is not a positive integer, an error message will be returned indicating the validation issue.

## Swagger UI

The API documentation is available at `http://localhost:3000/api`.

## Packages Used

- **NestJS**: A framework for building efficient, reliable, and scalable server-side applications.
- **TypeORM**: ORM for TypeScript and JavaScript for database management.
- **ffmpeg**: A tool to handle video processing tasks.
- **Swagger UI**: Tool for API documentation and testing.
- **multer**: Middleware for handling `multipart/form-data`, used for file uploads.
- **uuid**: Package for generating unique identifiers.

## Choices and Assumptions

- **Static API Tokens**: Used for authentication to simplify security management.
- **File Size and Duration Limits**: Configured to balance between performance and user needs.
- **Swagger UI**: Customized for a more polished and user-friendly API documentation interface.

## Assumptions

- The server has sufficient storage and processing capabilities to handle video files.
- Users have basic knowledge of how to interact with REST APIs.
- Videos are handled in common formats supported by `ffmpeg`.

## Contributing

Feel free to submit issues or pull requests. For any major changes or suggestions, please open an issue first.
