<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Schedule;

class ScheduleController extends Controller
{
    public function scheduleindex(Request $request){
        $schedules = Schedule::all();
        return response()->json($schedules);
    }

}
