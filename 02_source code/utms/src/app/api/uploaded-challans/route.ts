import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/db';
import UploadChallan from '@/lib/models/UploadedChallan.model';
import path from 'path';
import fs from 'fs/promises';

export const POST = async (req: NextRequest) => {
  try {
    await connect();

    // Parse multipart/form-data using NextRequest's formData()
    const formData = await req.formData();

    // Extract fields and files from FormData
    const fields: { [key: string]: string | string[] } = {};
    const files: { [key: string]: File | null } = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        fields[key] = value; // Handle text fields
      } else {
        files[key] = value; // Handle files (File objects)
      }
    }

    // Validate required fields
    const { userId, rollNo } = fields;
    if (!userId || !rollNo) {
      return NextResponse.json(
        { message: 'userId and rollNo are required' },
        { status: 400 }
      );
    }

    // Handle single image upload
    let imagePath: string | null = null;
    const file = files['image'] as File | null;
    if (file) {
      const uploadDir = path.join(process.cwd(), 'public/uploads/challans');
      await fs.mkdir(uploadDir, { recursive: true });

      const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const filePath = path.join(uploadDir, fileName);
      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      imagePath = `/uploads/challans/${fileName}`;
    }

    // Prepare the UploadChallan document
    const uploadChallanData = {
      ...fields,
      userId,
      rollNo,
      image: imagePath,
    };

    const uploadChallan = new UploadChallan(uploadChallanData);
    await uploadChallan.save();

    return NextResponse.json(
      { message: 'UploadChallan created', uploadChallan },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating uploadChallan:', error);
    return NextResponse.json(
      { message: 'Error creating uploadChallan', error: error.message },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    await connect();
    const uploadChallans = await UploadChallan.find({
      isActive: true,
    }).populate('userId');
    return NextResponse.json({ uploadChallans }, { status: 200 });
  } catch (error) {
    console.error('Error fetching uploadChallans:', error);
    return NextResponse.json(
      { message: 'Error fetching uploadChallans' },
      { status: 500 }
    );
  }
};

export const PUT = async (request: Request) => {
  try {
    await connect();
    const { _id, ...data } = await request.json();
    if (
      !data.challanStatus ||
      !['pending', 'Paid', 'Not Paid'].includes(data.challanStatus)
    ) {
      return NextResponse.json(
        { message: 'Invalid challanStatus' },
        { status: 400 }
      );
    }
    const uploadChallan = await UploadChallan.findByIdAndUpdate(_id, data, {
      new: true,
    });
    if (!uploadChallan) {
      return NextResponse.json(
        { message: 'UploadChallan not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'UploadChallan updated', uploadChallan },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating uploadChallan:', error);
    return NextResponse.json(
      { message: 'Error updating uploadChallan' },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    await connect();
    const { _id } = await request.json();
    const uploadChallan = await UploadChallan.findByIdAndUpdate(
      _id,
      { isActive: false },
      { new: true }
    );
    if (!uploadChallan) {
      return NextResponse.json(
        { message: 'UploadChallan not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'UploadChallan deactivated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deactivating uploadChallan:', error);
    return NextResponse.json(
      { message: 'Error deactivating uploadChallan' },
      { status: 500 }
    );
  }
};
