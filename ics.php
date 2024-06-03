<?php

header('Content-Type: text/calendar; charset=utf-8');
header('Content-Disposition: attachment; filename=lernplan.ics');

$bookmark = md5(uniqid());

$events = [];
$alreadydefined = [];


$ics = array(
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//pascal_mw//100 Tage v1.0//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:Europe/Berlin',
    'LAST-MODIFIED:20201011T015911Z',
    'TZURL:http://tzurl.org/zoneinfo-outlook/Europe/Berlin',
    'X-LIC-LOCATION:Europe/Berlin',
    'BEGIN:DAYLIGHT',
    'TZNAME:CEST',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0200',
    'DTSTART:19700329T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZNAME:CET',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0100',
    'DTSTART:19701025T030000',
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'END:STANDARD',
    'END:VTIMEZONE'
  );
$i = 1;

foreach($_POST as $key => $value) {
    //echo '$key = $value';
    if($key=='bookmark'){
        $bookmark = md5($value);
        continue;
    };
    if (stripos($value, 'lerntag') !== false){
      preg_match("/\d+/", $value, $alreadydefined);
    }
    if (empty($value)){
      while (in_array($i, $alreadydefined)){
        $i = $i + 1;
      };
      $value = 'Lerntag ' . $i;
      $i = $i + 1;
    };
    $ics[] = 'BEGIN:VEVENT';
    $ics[] = 'DTSTAMP:' . gmdate('Ymd').'T'. gmdate('His') . 'Z';
    $summary = $value;
    while (in_array($value, $events)){
      $value = $value . '_1';
    };
    $ics[] = 'UID:' . preg_replace('/\s+/', '', $value) . "." . $bookmark . '@wn0.de/100tage';
    $datum = explode("-", $key);
    $ics[] = 'DTSTART;VALUE=DATE:' . $datum[0] . $datum[1] . $datum[2];
    $date = $datum[1] . '-' . $datum[2] . '-' . $datum[0];
    $date1 = str_replace('-', '/', $date);
    $tomorrow = date('m-d-Y',strtotime($date1 . "+1 days"));
    $morgen = explode("-", $tomorrow);
    $ics[] = 'DTEND;VALUE=DATE:' . $morgen[2] . $morgen[0] . $morgen[1];
    $ics[] = 'SUMMARY:' . $summary;
    $ics[] = 'END:VEVENT';
    $events[] = $value;

  };

// Build ICS properties - add footer
$ics[] = 'END:VCALENDAR';


function to_string($array) {
    return implode("\r\n", $array);
  }

echo(to_string($ics));

?>